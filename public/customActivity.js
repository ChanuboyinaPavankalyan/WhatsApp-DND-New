window.onload = function () {
  const connection = new Postmonger.Session();
  let payload = {};

  connection.trigger('ready');

  connection.on('initActivity', function (data) {
    payload = data || {};
  });

  connection.on('clickedNext', function () {

    payload.metaData = { isConfigured: true };
    payload.name = 'Daytime Window Check';

    connection.trigger('updateActivity', payload);
  });
};
