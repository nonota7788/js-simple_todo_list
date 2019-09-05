var todos, modal, update;

//todoを管理するための配列
todos = { name: [], memo: [] };
//最初、モーダルは閉じているからfalseが入る
modal = false;

document.getElementById("btn-add").addEventListener("click", function() {
  var btn_add = document.getElementById("added-todo");

  //入力されたTODOを読み取る
  var addedTodo = btn_add.value;
  if (todos.name.length < 5 && validateInput(addedTodo)) {
    addTodo();
  } else if (todos.name.length < 5 === false) {
    //todoが５個追加されているにも関わらず、それ以上追加しようとした場合に警告文を表示する
    var message = "You can only add up to 5 todos!!";
    btn_add.value = message;
    btn_add.classList.add("warning");
  }

  //todoを追加する関数
  function addTodo() {
    //入力欄の初期化
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
    li.appendChild(input);
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
    btn_update.textContent = "UPDATE";
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
    update = true;
  }
  console.log(todos, todos.name);
});

//warningクラスを外すタイミングを監視するイベントリスナとハンドラ
document.querySelector(".input").addEventListener("input", function() {
  var btn_add = document.getElementById("added-todo");

  if (btn_add.value === "") {
    btn_add.classList.remove("warning");
  }
});

//UPDATEボタンを押した時に実行される関数
function updateTodo(todoId) {
  if (update) {
    var renewedTodo;
    if (modal) {
      renewedTodo = document.getElementById("title").value;
      document.getElementById(todoId).childNodes[0].value = renewedTodo;
    } else {
      renewedTodo = document.getElementById(todoId).childNodes[0].value;
    }

    if (renewedTodo === "") {
      document.getElementById(todoId).childNodes[0].value = todos.name[todoId];
    } else {
      todos.name[todoId] = renewedTodo;
    }

    document.getElementById("myModal").style.display = "none";
    modal = false;
  }

  console.log(todos, todos.name, todos.memo);
}

//todoを更新した際にUPDATボタンを押し忘れたら、更新直前のtodoが表示される
window.addEventListener("click", function() {
  for (var i = 0; i < todos.memo.length; i++) {
    document.getElementById(i).childNodes[0].value = todos.name[i];
  }
});

//個々のtodoの詳細を設定できるモーダルの表示
function setDetail(todoId) {
  modal = true;
  document.getElementById("myModal").style.display = "block";
  var btn_done = document.querySelector(".close");
  btn_done.setAttribute("onclick", `updateTodo(${todoId})`);
  btn_done.classList.add("changeble");

  //1,todo名の表示
  var title = document.getElementById("title");
  title.value = todos.name[todoId];
  title.setAttribute("onkeyup", `validateTitle(${todoId})`);
  //2,todoに関連したメモを表示
  var todo_memo = document.getElementById("memo");
  todo_memo.setAttribute("onkeyup", `handleMemo(${todoId})`);
  todos.memo[todoId]
    ? (todo_memo.value = todos.memo[todoId])
    : (todo_memo.value = "");
}

function validateTitle(todoId) {
  var title = document.getElementById("title").value;
  var btn_done = document.querySelector(".close");
  btn_done.classList.remove("unchangeble", "changeble");
  if (title === "") {
    update = false;
    btn_done.classList.add("unchangeble");
  } else {
    update = true;
    btn_done.classList.add("changeble");
  }
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
  //warningクラスがついている場合は取り外す
  document.getElementById("added-todo").classList.remove("warning");
  document.getElementById("added-todo").value = "";

  console.log(todos, todos.name);
}

//todoに関連したメモを追加する関数
function handleMemo(todoId) {
  var addedMemo = document.getElementById("memo").value;
  todos.memo[todoId] = addedMemo;
}

//追加されるtodoが空文字列ではないことのチェックをする関数
function validateInput(input) {
  var btn_add = document.getElementById("added-todo");
  if (btn_add.classList.contains("warning")) {
    btn_add.value = "Todo's name must be filled out !!";
    return false;
  } else if (input === "") {
    btn_add.value = "Todo's name must be filled out !!";
    btn_add.classList.add("warning");
    return false;
  } else {
    return true;
  }
}
