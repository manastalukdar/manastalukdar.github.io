// Copyright (c) 2023 Manas Talukdar
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

export default function setCorrectHJsStyle(theme: any) {
  if (theme.global.name.value.includes("dark")) {
    setCorrectHJsStyleBase("dark", "light");
  } else {
    setCorrectHJsStyleBase("light", "dark");
  }
}

function setCorrectHJsStyleBase(styleToEnable: string, styleToDisable: string) {
  let fileName = null;
  switch (styleToEnable) {
    case `dark`:
      fileName = "atom-one-dark.css";
      break;
    case "light":
      fileName = "atom-one-light.css";
      break;
  }
  const elementToEnable = document.getElementById(
    "highlightjs-" + styleToEnable
  );
  if (elementToEnable == null) {
    var head = document.getElementsByTagName("head")[0];
    var elementToCreate = document.createElement("link");
    elementToCreate.rel = "stylesheet";
    elementToCreate.id = "highlightjs-" + styleToEnable;
    elementToCreate.href = "/styles/" + fileName;
    //console.log(elementToCreate)
    head.appendChild(elementToCreate);
  }
  const elementToDisable = document.getElementById(
    "highlightjs-" + styleToDisable
  );
  if (elementToDisable != null) {
    elementToDisable.remove();
  }
}
