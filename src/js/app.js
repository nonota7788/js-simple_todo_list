/**
 * todoは5件まで登録可能
 * todoは上から順に追加されていく
 * todoを個別に削除すると、削除されたtodoより下のtodoは上に詰められる
 */

var todos;

todos = [];

document.getElementById("btn-add").addEventListener("click", function() {
  if (todos.length < 5) {
    var addedTodo;
    //入力されたTODOを読み取る
    addedTodo = document.getElementById("added-todo").value;
    document.getElementById("added-todo").value = "";

    // 1,変数todosに入力された値（todo）を格納する
    todos.push(addedTodo);
    // 2,todoリストに表示する
    var ul = document.querySelector("ul");
    var li = document.createElement("li");
    ul.appendChild(li);
    li.classList.add("todo-item");

    var input = document.createElement("input");
    li.appendChild(input);

    //ループで書き直す
    var createBtnUpdate = document.createElement("button");
    var createBtnDelete = document.createElement("button");
    createBtnUpdate.classList.add("btn");
    createBtnDelete.classList.add("btn");
    var btn_update = createBtnUpdate;
    var btn_delete = createBtnDelete;
    btn_update.classList.add("btn-update");
    btn_delete.classList.add("btn-delete");
    btn_update.textContent = "UPDATE";
    btn_delete.textContent = "DELETE";

    li.appendChild(btn_update);
    li.appendChild(btn_delete);

    var allInput = document.querySelectorAll("ul input");
    var allBtnDletete = document.querySelectorAll(".btn-delete");
    for (var i = 0; i < todos.length; i++) {
      allInput[i].classList.add(`todo-${i}`);
      document.querySelector(`.todo-${i}`).value = todos[i];
      allBtnDletete[i].setAttribute("onclick", `deleteTodo(${i})`);
    }
  }
});

function deleteTodo(todoId) {}

/*function deleteTodo(id) {
  num = id;
  todos.splice(id, 1);
  document.querySelector(`.todo-${id}`).value = "";
  console.log(todos);
  imcompList = true;
}*/
