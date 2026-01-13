require(["postmonger"], function(Postmonger) {
  var connection = new Postmonger.Session();
  connection.trigger("ready");

  connection.on("initActivity", function(data){
    var payload = data || {};
    payload.metaData = payload.metaData || {};
    payload.metaData.isConfigured = true;
    payload.name = "Daytime Window Check";
    connection.trigger("updateActivity", payload);
  });
});
