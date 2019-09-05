var todos, modal;

//todoを管理するための配列
todos = { name: [], memo: [] };
//最初、モーダルは閉じているからfalseが入る
modal = false;

document.getElementById("btn-add").addEventListener("click", function() {
  var btn_add = document.getElementById("added-todo");
  if (todos.name.length < 5) {
    var addedTodo;
    //入力されたTODOを読み取る
    addedTodo = btn_add.value;
    btn_add.value = "";

    // 1, 配列todosに入力された値（todo）を格納する
    todos.name.push(addedTodo);
    todos.memo.push("");

    // 2, todoリストに表示する
    var ol = document.querySelector("ol");
    var li = document.createElement("li");
    ol.appendChild(li);
    li.classList.add("todo-item");
    var input = document.createElement("input");
    var btn_delete = document.createElement("button");
    var btn_detail = document.createElement("button");
    li.appendChild(input);
    li.appendChild(btn_detail);
    li.appendChild(btn_delete);
    btn_detail.classList.add("btn", "btn-detail");
    btn_delete.classList.add("btn", "btn-delete");
    var rearmostTodoIndex = todos.name.length - 1;
    input.value = todos.name[rearmostTodoIndex];
    btn_detail.textContent = "DETAIL";
    btn_delete.textContent = "DELETE";

    //3, 新しく追加されたtodoに、配列todosの中で割り振られたindexと同じ番号を振る。
    /**
     * 目的は、後にtodoを削除・更新する際に個々のtodoを識別できるようにするため。
     * これにより、liのid属性、更新・削除ボタンのonclick属性の値deleteTodo関数・updateTodo関数の引数、
     * 配列todosに格納されるtodoのインデックス番号、それぞれの値は、全て同じ値（０〜５）で紐づいている。
     */
    var rearmostTodo;

    rearmostTodo = document.querySelectorAll(".todo-item")[rearmostTodoIndex];
    rearmostTodo.setAttribute("id", rearmostTodoIndex);
    rearmostTodo.childNodes[0].setAttribute(
      "onkeyup",
      `updateTodo(${rearmostTodoIndex})`
    );
    rearmostTodo.childNodes[1].setAttribute(
      "onclick",
      `setDetail(${rearmostTodoIndex})`
    );
    rearmostTodo.childNodes[2].setAttribute(
      "onclick",
      `deleteTodo(${rearmostTodoIndex})`
    );
  } else {
    //todoが５個追加されているにも関わらず、それ以上追加しようとした場合に警告文を表示する
    var message = "You can only add up to 5 todos!!";
    btn_add.value = message;
    btn_add.classList.add("warning");
  }
});

//UPDATEボタンを押した時に実行される関数
function updateTodo(todoId) {
  var renewedTodo;
  if (modal) {
    renewedTodo = document.getElementById("title").value;
    document.getElementById(todoId).childNodes[0].value = renewedTodo;
  } else {
    renewedTodo = document.getElementById(todoId).childNodes[0].value;
  }
  todos.name[todoId] = renewedTodo;
}

//delteボタンを押したときに実行される関数
function deleteTodo(todoId) {
  //各リストに振られている番号を1つ繰り下げる
  for (var i = 0; i < todos.name.length - (todoId + 1); i++) {
    var updatedList = document.getElementById(`${todoId + (i + 1)}`);
    var updatedId = updatedList.id;
    updatedId = updatedId - 1;
    updatedList.id = updatedId;
    updatedList.childNodes[0].setAttribute(
      "onkeyup",
      `updateTodo(${updatedId})`
    );
    updatedList.childNodes[1].setAttribute(
      "onclick",
      `setDetail(${updatedId})`
    );
    updatedList.childNodes[2].setAttribute(
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
  //warningクラスがついている場合は取り外す
  document.getElementById("added-todo").classList.remove("warning");
  document.getElementById("added-todo").value = "";
}

//個々のtodoの詳細を設定できるモーダルの表示
function setDetail(todoId) {
  modal = true;
  document.getElementById("myModal").style.display = "block";
  //1,todo名の表示
  var title = document.getElementById("title");
  title.setAttribute("onkeyup", `updateTodo(${todoId})`);
  title.value = todos.name[todoId];
  //2,todoに関連したメモを表示
  var todo_memo = document.getElementById("memo");
  todo_memo.setAttribute("onkeyup", `handleMemo(${todoId})`);
  todos.memo[todoId]
    ? (todo_memo.value = todos.memo[todoId])
    : (todo_memo.value = "");
}

//モーダルを閉じる
function closeModal() {
  modal = false;
  document.getElementById("myModal").style.display = "none";
}

//todoに関連したメモを追加する関数
function handleMemo(todoId) {
  var addedMemo = document.getElementById("memo").value;
  todos.memo[todoId] = addedMemo;
}
