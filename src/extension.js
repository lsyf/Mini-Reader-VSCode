const vscode = require("vscode");
const Book = require("./Book");

exports.activate = function (context) {
  console.log("activate");

  var showStatus = (msg) => {
    vscode.window.setStatusBarMessage(msg);
  };

  const bossCode = vscode.commands.registerCommand("extension.bossCode", () => {
    showStatus("vue is working");
  });

  var book = new Book(showStatus);
  const nextPage = vscode.commands.registerCommand("extension.nextPage", () => {
    showStatus(book.calc(1));
  });

  const prePage = vscode.commands.registerCommand("extension.prePage", () => {
    showStatus(book.calc(-1));
  });

  context.subscriptions = [
    ...context.subscriptions,
    bossCode,
    nextPage,
    prePage,
  ];
};

exports.deactivate = function () {
  console.log("deactivate");
};
