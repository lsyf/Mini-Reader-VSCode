const vscode = require("vscode");
const Book = require("./Book");

exports.activate = function (context) {
  const bossCode = vscode.commands.registerCommand("extension.bossCode", () => {
    let lauage_arr_list = [
      "jquery is working",
      "vue is working",
      "react is working",
      "angular is working",
      "js is working",
      "html is working",
    ];
    var index = Math.floor(Math.random() * lauage_arr_list.length);
    vscode.window.setStatusBarMessage(lauage_arr_list[index]);
  });

  const nextPage = vscode.commands.registerCommand("extension.nextPage", () => {
    vscode.window.setStatusBarMessage(new Book(context).getNextPage());
  });

  const prePage = vscode.commands.registerCommand("extension.prePage", () => {
    vscode.window.setStatusBarMessage(new Book(context).getPrePage());
  });

  context.subscriptions = [
    ...context.subscriptions,
    bossCode,
    nextPage,
    prePage,
  ];
};

exports.deactivate = function () {};
