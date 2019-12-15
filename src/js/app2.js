const app = (() => {
  /*--------------------------------*/
  /* DATA MODULE */
  /*--------------------------------*/
  const todosController = (() => {
    const Todos = function(id, description) {
      this.id = id;
      this.done = "uncomp";
      this.description = description;
    };

    const data = {
      todoItems: [],
      overview: {
        total: 0,
        comp: 0,
        uncomp: 0
      },
      update: {
        input: null,
        id: null
      }
    };

    return {
      addTodoItem: function(description) {
        //1: create unique id
        let ID;
        if (data.todoItems.length === 0) {
          ID = 0;
        } else {
          ID = data.todoItems[data.todoItems.length - 1].id + 1;
        }
        //2: create Todo instance
        const newItem = new Todos(ID, description);

        //3: insert Todo instace into data structure
        data.todoItems.push(newItem);
      },

      getTodoItem: function(i) {
        // 1:todoの追加 or todoの更新
        let index;
        data.update.id ? (index = i) : (index = data.todoItems.length - 1);

        // 2:Return todo item obj
        return data.todoItems[index];
      },

      getTotalNum: function() {
        return data.todoItems.length;
      },

      calculateOverview: function() {
        // 1: Calaculate todos'total number
        data.overview.total = this.getTotalNum();

        // 2: Calaculate todos'uncomp number
        const uncomp = data.todoItems.map(cur => {
          if (cur.done === "uncomp") return cur;
        });

        data.overview.uncomp = uncomp.length;

        // 3: Calaculate todos'comp number (comp = total - uncomp)
        data.overview.comp = data.overview.total - data.overview.uncomp;
      },

      getOverview: function() {
        return {
          total: data.overview.total,
          uncomp: data.overview.uncomp,
          comp: data.overview.comp
        };
      },

      deleteTodo: function(todoID) {
        // 1: 削除対象のidのindexを取得する
        const index = this.handleIDs(todoID);

        // 2: spliceメソッドを使って、該当するtodoオブジェクトを配列（data.allItems）から削除する
        data.todoItems.splice(index, 1);
      },

      handleIDs: function(ID) {
        // 1: todoオブジェクトからidプロパティのみを取り出し、idのみの配列に変換を生成する
        const ids = data.todoItems.map(cur => {
          return cur.id;
        });

        // 2: idのみの配列から、対象のid番号のindexを取得する（対象のid番号のindex = 取得したいtodoオブジェクトのindex)
        const index = ids.indexOf(ID);

        // 3: Return index
        return index;
      },

      storeUpdatingData: function(input, id) {
        data.update.input = input;
        data.update.id = id;
      },

      getUpdatingData: function() {
        return data.update;
      },

      resetUpdatingData: function() {
        data.update.input = null;
        data.update.id = null;
      },

      updateItemDesc: function(index, newDesc) {
        data.todoItems[index].description = newDesc;
      },

      testData: function() {
        console.log(data);
      }
    };
  })();

  /*--------------------------------*/
  /* UI MODULE */
  /*--------------------------------*/
  const UIController = (() => {
    const DOMstrings = {
      addBtn: ".btn__done",
      nextItemDesc: ".next__description",
      todosContainer: ".todos__list",
      nextItem: ".next",
      todoItem: "item", // Because of using this in getElemetByClassName() argument, there is no need to use '.' before text.
      blankItem: ".blank",
      totalLabel: ".overview__total--value",
      compLabel: ".overview__comp--value",
      uncompLabel: ".overview__uncomp--value",
      itemDesc: "item__description" // Because of using this in classList.contains() argument, there is no need to use '.' before text.
    };

    const createNextList = () => {
      const html = `<li class="next"><div class="next__add"><ion-icon name="add" class="next__add--icon"></ion-icon>
                    </div><div class="next__container"><input type="text" class="next__description" /></div></li>`;
      return html;
    };

    const createBlankList = () => {
      const html = `<li class="blank"><div class="blank__left"></div><div class="blank__container">&nbsp;</div></li>`;
      return html;
    };

    return {
      getInput: function() {
        return document.querySelector(DOMstrings.nextItemDesc).value;
      },

      displayTodoItem: function(obj, num) {
        //1: Create html
        const html = `<li class="item" id=${obj.id}> <div class="item__done"><button type="button" class="item__done--btn ${obj.done}"></button></div>
                      <div class="item__container"><input type="text" class="item__description" value=${obj.description} /><div class="item__delete">
                      <button type="button" class="item__delete--btn"><ion-icon name="close-circle-outline" class="item--delete--icon ${obj.id}"></ion-icon>
                      </button></div></div></li>`;

        //2: Insert html(newly created todo item) right before 'next'
        const target = document.querySelector(DOMstrings.nextItem);
        target.insertAdjacentHTML("beforebegin", html);

        //4: Clear 'next' input value
        document.querySelector(DOMstrings.nextItemDesc).value = "";

        //5: Remove one 'blank' list from UI
        if (num < 5) {
          const deleteTarget = document.querySelector(DOMstrings.blankItem);
          document
            .querySelector(DOMstrings.todosContainer)
            .removeChild(deleteTarget);
        }
      },

      //displayListが本当に必要なのかは疑問
      displayList: function() {
        const target = document.querySelector(DOMstrings.todosContainer);
        target.insertAdjacentHTML("beforeend", createNextList());
        for (let i = 0; i < 4; i++) {
          target.insertAdjacentHTML("beforeend", createBlankList());
        }
      },

      displayOverview: function(overview) {
        document.querySelector(DOMstrings.totalLabel).textContent =
          overview.total;
        document.querySelector(DOMstrings.compLabel).textContent =
          overview.comp;
        document.querySelector(DOMstrings.uncompLabel).textContent =
          overview.uncomp;
      },

      getSelectedTodoId: function(event) {
        return parseInt(event.target.classList.item(1));
      },

      deleteTodoItem: function(id, num) {
        const deleteTarget = document.getElementById(id);
        const parentElem = document.querySelector(DOMstrings.todosContainer);

        // 1: Remove todo item from UI
        parentElem.removeChild(deleteTarget);

        // 2: Create a 'blank' list if the number of todos are less than 4
        if (num < 4) {
          parentElem.insertAdjacentHTML("beforeend", createBlankList());
        }
      },

      updateValueAttr: function(input, id) {
        document.getElementById(id).childNodes[3].childNodes[0].value = input;
      },

      getDOMstrings: function() {
        return DOMstrings;
      }
    };
  })();

  /*--------------------------------*/
  /* CONTROLLER MODULE */
  /*--------------------------------*/
  const AppController = ((todosCtrl, UICtrl) => {
    const setUpEventListener = () => {
      const DOM = UICtrl.getDOMstrings();
      document.querySelector(DOM.addBtn).addEventListener("click", () => {
        todosCtrl.getUpdatingData().input ||
        todosCtrl.getUpdatingData().input === ""
          ? ctrlUpdateTodo()
          : ctrlAddTodo();
      });
      document.addEventListener("keydown", () => {
        if (event.key === "Enter") {
          event.preventDefault();
          todosCtrl.getUpdatingData().input ||
          todosCtrl.getUpdatingData().input === ""
            ? ctrlUpdateTodo()
            : ctrlAddTodo();
        }
      });
      document
        .querySelector(DOM.todosContainer)
        .addEventListener("click", event => {
          todosCtrl.getUpdatingData().input ||
          todosCtrl.getUpdatingData().input === ""
            ? ctrlUpdateTodo()
            : ctrlDeleteTodo(event);
        });

      document
        .querySelector(DOM.todosContainer)
        .addEventListener("input", event => {
          if (event.target.classList.contains(DOM.itemDesc)) {
            ctrlDetectInput(event);
          }
        });
    };

    const updateOverview = () => {
      // 1: Calculate overview (total, uncomp, comp)
      todosCtrl.calculateOverview();

      // 2: Get overview
      const overview = todosCtrl.getOverview();

      // 3: update todos's overview
      UICtrl.displayOverview(overview);
    };

    const ctrlAddTodo = () => {
      console.log("add!");
      // 1: Get input value from the UI
      const input = UICtrl.getInput();

      if (input) {
        // 2: Add input value to data structure
        todosCtrl.addTodoItem(input);

        // 3: Get newly created todo from data structure
        const todoItem = todosCtrl.getTodoItem();

        // 4: Get number of all todo items
        const todoNum = todosCtrl.getTotalNum();

        // 5: Display todo item using input value
        UICtrl.displayTodoItem(todoItem, todoNum);

        // 6: Calculate and update todo's overview
        updateOverview();
      }
    };

    const ctrlDeleteTodo = event => {
      console.log("delete");
      // 1: Get todo's id
      const ID = UICtrl.getSelectedTodoId(event);

      if (ID || ID === 0) {
        console.log("delete completed");
        // 2: Delete todo obj from data structure
        todosCtrl.deleteTodo(ID);

        // 3: Get the number of all todo items
        const totalNum = todosCtrl.getTotalNum();

        // 4: Delete todo from UI
        UICtrl.deleteTodoItem(ID, totalNum);

        // 5: Update and show overview
        updateOverview();
      }
    };

    const ctrlDetectInput = event => {
      // 1: Get a changing input one by one
      const input = event.target.value;

      // 2: Get a updating list's ID
      const ID = parseInt(event.target.parentNode.parentNode.id);

      // 3: Add the changing input one by one to the data structure
      todosCtrl.storeUpdatingData(input, ID);
    };

    const ctrlUpdateTodo = () => {
      console.log("update");

      // 1: data.updatingDataの値を取得する
      const obj = todosCtrl.getUpdatingData();

      if (obj.input) {
        // 2: input要素のvalue属性の値を更新する
        UICtrl.updateValueAttr(obj.input, obj.id);

        // 3:Get index for the list to be updated
        const index = todosCtrl.handleIDs(obj.id);

        // 4:該当するTodoのデータ保管庫のdescriptionの値を更新する
        todosCtrl.updateItemDesc(index, obj.input);
      } else {
        // 更新した際、何も入力されずに、空文字の場合は更新前の値に戻す。

        // 1: Get index
        const index = todosCtrl.handleIDs(obj.id);

        // 2: data.todoItemsから該当するtodoオブジェクトを取得する
        const itemObj = todosCtrl.getTodoItem(index);

        // 3:　該当するtodoのinput要素のvalue属性を元に戻す
        UICtrl.updateValueAttr(itemObj.description, obj.id);
      }
      // 5: data.update.inputとdata.update.idをそれぞれnullに戻す
      todosCtrl.resetUpdatingData();
    };

    return {
      init: () => {
        console.log("Appliction has started!!");
        UICtrl.displayOverview({
          total: 0,
          comp: 0,
          uncomp: 0
        });
        UICtrl.displayList();
        setUpEventListener();
      }
    };
  })(todosController, UIController);
  AppController.init();

  return {
    test: () => {
      todosController.testData();
    }
  };
})();
