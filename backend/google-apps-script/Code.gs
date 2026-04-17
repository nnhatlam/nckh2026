const SHEET_NAME = "SurveyResponses";

function getTargetSpreadsheet() {
  const spreadsheetId =
    PropertiesService.getScriptProperties().getProperty("SPREADSHEET_ID");

  if (spreadsheetId) {
    return SpreadsheetApp.openById(spreadsheetId);
  }

  const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  if (activeSpreadsheet) {
    return activeSpreadsheet;
  }

  throw new Error(
    "No spreadsheet configured. Set Script Property SPREADSHEET_ID to your Google Sheet ID.",
  );
}

function normalizeAnswerValue(value) {
  if (Array.isArray(value)) {
    return value.join(" | ");
  }

  if (value === null || value === undefined) {
    return "";
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
}

function flattenQuestionAnswers(prefix, answers) {
  const flattened = {};

  (answers || []).forEach((item) => {
    if (!item || !item.id) {
      return;
    }

    flattened[`${prefix}_${item.id}`] = normalizeAnswerValue(item.answer);
  });

  return flattened;
}

function flattenChoiceResponses(choiceResponses) {
  const flattened = {};

  (choiceResponses || []).forEach((response, index) => {
    const order = index + 1;
    const prefix = `choice_${order}`;

    flattened[`${prefix}_set_id`] = normalizeAnswerValue(response.setId);
    flattened[`${prefix}_choice_set`] = normalizeAnswerValue(
      response.choiceSet,
    );
    flattened[`${prefix}_block`] = normalizeAnswerValue(response.block);
    flattened[`${prefix}_position_left`] = normalizeAnswerValue(
      response.positionLeft,
    );
    flattened[`${prefix}_position_right`] = normalizeAnswerValue(
      response.positionRight,
    );
    flattened[`${prefix}_selected`] = normalizeAnswerValue(
      response.selected || (response.optOut ? "opt_out" : ""),
    );
    flattened[`${prefix}_selected_source_key`] = normalizeAnswerValue(
      response.selectedSourceKey,
    );
    flattened[`${prefix}_selected_label`] = normalizeAnswerValue(
      response.selectedLabel,
    );
    flattened[`${prefix}_opt_out`] = response.optOut ? "TRUE" : "FALSE";
  });

  return flattened;
}

function buildSubmissionRecord(payload) {
  return {
    timestamp: new Date(),
    session_id: payload.sessionId || "",
    assigned_block: payload.assignedBlock || "",
    completed_at: payload.completedAt || "",
    ...flattenQuestionAnswers("general", payload.generalAnswers || []),
    ...flattenQuestionAnswers("personal", payload.personalAnswers || []),
    ...flattenChoiceResponses(payload.choiceResponses || []),
  };
}

function getHeaders(sheet) {
  if (sheet.getLastRow() === 0 || sheet.getLastColumn() === 0) {
    return [];
  }

  const rawHeaders = sheet
    .getRange(1, 1, 1, sheet.getLastColumn())
    .getValues()[0];
  return rawHeaders.map((header) => String(header || "").trim());
}

function ensureHeaders(sheet, record) {
  const existingHeaders = getHeaders(sheet);
  const recordHeaders = Object.keys(record);

  if (existingHeaders.length === 0) {
    sheet.getRange(1, 1, 1, recordHeaders.length).setValues([recordHeaders]);
    return recordHeaders;
  }

  const missingHeaders = recordHeaders.filter(
    (header) => !existingHeaders.includes(header),
  );

  if (missingHeaders.length === 0) {
    return existingHeaders;
  }

  const updatedHeaders = [...existingHeaders, ...missingHeaders];
  sheet.getRange(1, 1, 1, updatedHeaders.length).setValues([updatedHeaders]);
  return updatedHeaders;
}

function appendRecord(sheet, record) {
  const headers = ensureHeaders(sheet, record);
  const row = headers.map((header) =>
    Object.prototype.hasOwnProperty.call(record, header) ? record[header] : "",
  );

  sheet.appendRow(row);
}

function doPost(e) {
  try {
    const payload = JSON.parse(
      (e && e.postData && e.postData.contents) || "{}",
    );
    const spreadsheet = getTargetSpreadsheet();
    const sheet =
      spreadsheet.getSheetByName(SHEET_NAME) ||
      spreadsheet.insertSheet(SHEET_NAME);

    const record = buildSubmissionRecord(payload);
    appendRecord(sheet, record);

    const output = ContentService.createTextOutput(
      JSON.stringify({
        ok: true,
        appended: 1,
        columns: Object.keys(record).length,
      }),
    );

    output.setMimeType(ContentService.MimeType.JSON);
    return output;
  } catch (error) {
    const output = ContentService.createTextOutput(
      JSON.stringify({
        ok: false,
        error: String(error),
      }),
    );

    output.setMimeType(ContentService.MimeType.JSON);
    return output;
  }
}
