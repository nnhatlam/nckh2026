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

function doPost(e) {
  try {
    const payload = JSON.parse(
      (e && e.postData && e.postData.contents) || "{}",
    );
    const spreadsheet = getTargetSpreadsheet();
    const sheet =
      spreadsheet.getSheetByName(SHEET_NAME) ||
      spreadsheet.insertSheet(SHEET_NAME);

    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp",
        "Session_ID",
        "Assigned_Block",
        "Set_ID",
        "Position_Left",
        "Position_Right",
        "Selected",
        "Selected_Label",
        "General_Answers_JSON",
        "Choice_Payload_JSON",
      ]);
    }

    const generalJson = JSON.stringify(payload.generalAnswers || []);
    const choiceResponses = payload.choiceResponses || [];

    choiceResponses.forEach((response) => {
      sheet.appendRow([
        new Date(),
        payload.sessionId || "",
        payload.assignedBlock || "",
        response.setId || "",
        response.positionLeft || "",
        response.positionRight || "",
        response.selected || (response.optOut ? "opt_out" : ""),
        response.selectedLabel || "",
        generalJson,
        JSON.stringify(response),
      ]);
    });

    const output = ContentService.createTextOutput(
      JSON.stringify({
        ok: true,
        appended: choiceResponses.length,
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
