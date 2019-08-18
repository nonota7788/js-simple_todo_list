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
    console.log(todos);

    // 2,todoリストに表示する
    for (var i = 0; i < todos.length; i++) {
      document.querySelector(`.todo-${i}`).value = todos[i];
    }
  }
});
