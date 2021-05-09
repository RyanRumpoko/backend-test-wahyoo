const exec = require("child_process").exec;
exec("cd orchestrator && nodemon app.js");
exec("cd service/client && nodemon app.js");
