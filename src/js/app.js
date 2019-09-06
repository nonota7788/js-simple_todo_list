var todos, modal, changeble;

//todoを管理するための配列
todos = { name: [], memo: [] };
//最初、モーダルは閉じているからfalseが入る
modal = false;

document.getElementById("btn-add").addEventListener("click", function() {
  var addedTodo = document.getElementById("added-todo");
  validate(addedTodo);

  if (changeble) {
    // 1, 配列todosに入力された値（todo）を格納する
    todos.name.push(addedTodo.value);
    todos.memo.push("");
    addedTodo.value = "";

    // 2, todoリストに表示する
    var ol = document.querySelector("ol");
    var li = document.createElement("li");
    ol.appendChild(li);
    li.classList.add("todo-item");
    var input = document.createElement("input");
    li.appendChild(input);
    input.classList.add("name");
    var btn_delete = document.createElement("button");
    var btn_detail = document.createElement("button");
    var btn_update = document.createElement("button");
    li.appendChild(btn_update);
    li.appendChild(btn_detail);
    li.appendChild(btn_delete);
    btn_update.classList.add("btn", "btn-update");
    btn_detail.classList.add("btn", "btn-detail");
    btn_delete.classList.add("btn", "btn-delete");
    var rearmostTodoIndex = todos.name.length - 1;
    input.value = todos.name[rearmostTodoIndex];
    btn_update.textContent = "Update";
    btn_detail.textContent = "DETAIL";
    btn_delete.textContent = "Delete";

    //3, 新しく追加されたtodoに、配列todosの中で割り振られたindexと同じ番号を振る。
    /**
     * 目的は、後にtodoを削除・更新する際に個々のtodoを識別できるようにするため。
     * これにより、liのid属性、更新・削除ボタンのonclick属性の値deleteTodo関数・updateTodo関数の引数、
     * 配列todosに格納されるtodoのインデックス番号、それぞれの値は、全て同じ値（０〜５）で紐づいている。
     */
    var rearmostTodo;

    rearmostTodo = document.querySelectorAll(".todo-item")[rearmostTodoIndex];
    rearmostTodo.setAttribute("id", rearmostTodoIndex);
    rearmostTodo.childNodes[0].setAttribute("onkeyup", "validate(this)");
    rearmostTodo.childNodes[1].setAttribute(
      "onclick",
      `updateTodo(${rearmostTodoIndex})`
    );
    rearmostTodo.childNodes[2].setAttribute(
      "onclick",
      `setDetail(${rearmostTodoIndex})`
    );
    rearmostTodo.childNodes[3].setAttribute(
      "onclick",
      `deleteTodo(${rearmostTodoIndex})`
    );
  }
});

//追加されるtodo名(todos.name)が空文字列ではないことのチェックをする関数
function validate(tood_name) {
  //モーダルからtodo名を更新する場合
  if (modal) {
    tood_name = document.getElementById("title").value;
    var btn_done = document.querySelector(".close").classList;
    btn_done.remove("unchangeble", "changeble");
    tood_name === "" ? btn_done.add("unchangeble") : btn_done.add("changeble");
  } else {
    tood_name = tood_name.value;
  }
  tood_name === "" ? (changeble = false) : (changeble = true);
}

//UPDATEボタン、又は、モダールのDONEボタンを押した時に実行されるtodoの更新を担う関数
function updateTodo(todoId) {
  if (changeble) {
    var renewedTodo;
    //モーダルからの更新か、それともリストからの更新かで条件分岐
    if (modal) {
      renewedTodo = document.getElementById("title").value;
      document.getElementById(todoId).childNodes[0].value = renewedTodo;
      todos.name[todoId] = renewedTodo;
      document.getElementById("myModal").style.display = "none";
      modal = false;
    } else {
      renewedTodo = document.getElementById(todoId).childNodes[0].value;
      todos.name[todoId] = renewedTodo;
    }
  }
}

//todoを更新した際にUPDATボタンを押し忘れたり、空文字で更新しようとしたら、更新直前のtodoが表示される
window.addEventListener("click", function() {
  for (var i = 0; i < todos.memo.length; i++) {
    document.getElementById(i).childNodes[0].value = todos.name[i];
  }
});

//個々のtodoの詳細を設定できるモーダルの表示
function setDetail(todoId) {
  changeble = true;
  modal = true;
  document.getElementById("myModal").style.display = "block";
  var btn_done = document.querySelector(".close");
  btn_done.setAttribute("onclick", `updateTodo(${todoId})`);
  btn_done.classList.add("changeble");

  //1,todo名の表示
  var title = document.getElementById("title");
  title.value = todos.name[todoId];
  title.setAttribute("onkeyup", "validate()");

  //2,todoに関連したメモを表示
  var todo_memo = document.getElementById("memo");
  todo_memo.setAttribute("onkeyup", `handleMemo(${todoId})`);
  todos.memo[todoId]
    ? (todo_memo.value = todos.memo[todoId])
    : (todo_memo.value = "");
}

//delteボタンを押したときに実行される関数
function deleteTodo(todoId) {
  //各リストに振られている番号を1つ繰り下げる
  for (var i = 0; i < todos.name.length - (todoId + 1); i++) {
    var updatedList = document.getElementById(`${todoId + (i + 1)}`);
    var updatedId = updatedList.id;
    updatedId = updatedId - 1;
    updatedList.id = updatedId;
    updatedList.childNodes[1].setAttribute(
      "onclick",
      `updateTodo(${updatedId})`
    );
    updatedList.childNodes[2].setAttribute(
      "onclick",
      `setDetail(${updatedId})`
    );
    updatedList.childNodes[3].setAttribute(
      "onclick",
      `deleteTodo(${updatedId})`
    );
  }
  //DOMから削除する
  var deletedList = document.getElementById(todoId);
  deletedList.parentNode.removeChild(deletedList);
  //配列todosから削除する
  todos.name.splice(todoId, 1);
  todos.memo.splice(todoId, 1);
}

//todoに関連したメモを追加する関数
function handleMemo(todoId) {
  var addedMemo = document.getElementById("memo").value;
  todos.memo[todoId] = addedMemo;
}
