var todos;

//todoを管理するための配列
todos = [];

document.getElementById("btn-add").addEventListener("click", function() {
  if (todos.length < 5) {
    var addedTodo;
    //入力されたTODOを読み取る
    addedTodo = document.getElementById("added-todo").value;
    document.getElementById("added-todo").value = "";

    // 1,配列todosに入力された値（todo）を格納する
    todos.push(addedTodo);

    // 2,todoリストに表示する
    var ol = document.querySelector("ol");
    var li = document.createElement("li");
    ol.appendChild(li);
    li.classList.add("todo-item");
    var input = document.createElement("input");
    var btn_update = document.createElement("button");
    var btn_delete = document.createElement("button");
    li.appendChild(input);
    li.appendChild(btn_update);
    li.appendChild(btn_delete);
    btn_update.classList.add("btn", "btn-update");
    btn_delete.classList.add("btn", "btn-delete");
    btn_update.textContent = "UPDATE";
    btn_delete.textContent = "DELETE";
    /**
     * 後にtodoを削除・更新する際に、個々のtodoを識別できるよう、
     * 配列todosのindexと紐づくidを一番上のtodoから０番から順に振る
     *
     * liのid属性、更新・削除ボタンのonclick属性の値deleteTodo関数・updateTodo関数の引数、
     * 配列todosに格納されるtodoのインデックス番号、それぞれの値は、全て同じ値（０〜５）で紐づいている。
     */
    var allTodoList = document.querySelectorAll(".todo-item");
    var allBtnUpdate = document.querySelectorAll(".btn-update");
    var allBtnDlete = document.querySelectorAll(".btn-delete");

    for (var i = 0; i < todos.length; i++) {
      allTodoList[i].setAttribute("id", i);
      document.getElementById(i).childNodes[0].value = todos[i];
      allBtnUpdate[i].setAttribute("onclick", `updateTodo(${i})`);
      allBtnDlete[i].setAttribute("onclick", `deleteTodo(${i})`);
    }
    console.log(todos);
  }
});

//UPDATEボタンを押した時に実行される関数
function updateTodo(todoId) {
  var renewedTodo = document.getElementById(todoId).childNodes[0].value;
  todos[todoId] = renewedTodo;
}

//delteボタンを押したときに実行される関数
function deleteTodo(todoId) {
  //各リストに振られている番号を1つ繰り下げる
  for (var i = 0; i < todos.length - (todoId + 1); i++) {
    var updatedList = document.getElementById(`${todoId + (i + 1)}`);
    var updatedId = updatedList.id;
    updatedId = updatedId - 1;
    updatedList.id = updatedId;
    updatedList.childNodes[2].setAttribute(
      "onclick",
      `deleteTodo(${updatedId})`
    );
  }
  //DOMから削除する
  var deletedList = document.getElementById(todoId);
  deletedList.parentNode.removeChild(deletedList);
  //配列todosから削除する
  todos.splice(todoId, 1);
  console.log(todos);
}
