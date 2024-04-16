const vscode = require("vscode");
const Book = require("./Book");

exports.activate = function (context) {
  console.log("activate");

  var showStatus = (msg) => {
    vscode.window.setStatusBarMessage(msg);
  };

  const bossCode = vscode.commands.registerCommand("extension.bossCode", () => {
    showStatus(book.switchEnabled());
  });

  var book = new Book(showStatus);
  const nextPage = vscode.commands.registerCommand("extension.nextPage", () => {
    if (book.enabled) {
      showStatus(book.calc(1));
    }
  });

  const prePage = vscode.commands.registerCommand("extension.prePage", () => {
    if (book.enabled) {
      showStatus(book.calc(-1));
    }
  });

  const nextFind = vscode.commands.registerCommand("extension.nextFind", () => {
    if (book.enabled) {
      showStatus(book.find("next"));
    }
  });

  const preFind = vscode.commands.registerCommand("extension.preFind", () => {
    if (book.enabled) {
      showStatus(book.find("pre"));
    }
  });

  context.subscriptions = [
    ...context.subscriptions,
    bossCode,
    nextPage,
    prePage,
    nextFind,
    preFind,
  ];
};

exports.deactivate = function () {
  console.log("deactivate");
};
