window.onload = function () {
  const connection = new Postmonger.Session();
  let payload = {};

  connection.trigger("ready");

  connection.on("initActivity", function (data) {
    payload = data || {};
  });

  connection.on("clickedNext", function () {
    payload.arguments = payload.arguments || {};
    payload.arguments.execute = payload.arguments.execute || {};

    payload.arguments.execute.inArguments = [
      { country: "{{Contact.Attribute.EntrySource.Country}}" }
    ];

    payload.metaData.isConfigured = true;
    payload.metaData.label = "Auto Country Window Check";
    payload.name = "Daytime Window Check";

    connection.trigger("updateActivity", payload);
  });
};
