window.onload = function () {
  const connection = new Postmonger.Session();
  let payload = {};

  /* Required lifecycle trigger */
  connection.trigger("ready");

  /* Init activity */
  connection.on("initActivity", function (data) {
    payload = data || {};
  });

  /* User clicks Done */
  connection.on("clickedNext", function () {

    payload.arguments = payload.arguments || {};
    payload.arguments.execute = payload.arguments.execute || {};

    /**
     * IMPORTANT:
     * inArguments MUST exist and MUST match schema
     * Country is resolved from Entry Source DE
     */
    payload.arguments.execute.inArguments = [
      {
        country: "{{Contact.Attribute.EntrySource.Country}}"
      }
    ];

    payload.metaData = payload.metaData || {};
    payload.metaData.isConfigured = true;

    /* Labels on canvas */
    payload.metaData.label = "Auto Country Window Check";
    payload.name = "Daytime Window Check";

    connection.trigger("updateActivity", payload);
  });
};
