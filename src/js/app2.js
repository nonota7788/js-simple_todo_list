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

      getTodoItem: function() {
        return data.todoItems[data.todoItems.length - 1];
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

      deleteTodoItem: function(id) {
        // 1: todoオブジェクトからidプロパティのみを取り出し、idのみの配列に変換を生成する
        const ids = data.todoItems.map(cur => {
          return cur.id;
        });

        // 2: idのみの配列から、削除対象のid番号のindexを取得する（削除対象のid番号のindex = 削除したいtodoオブジェクトのindex)
        const index = ids.indexOf(id);

        // 3: spliceメソッドを使って、該当するtodoオブジェクトを配列（data.allItems）から削除する
        data.todoItems.splice(index, 1);
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
      nextItemDesc: ".next .item__description",
      todosContainer: ".todos__list",
      nextItem: ".next",
      todoItem: "item", // Because of using this in getElemetByClassName() argument, there is no '.' before text.
      blankItem: ".blank",
      totalLabel: ".overview__total--value",
      compLabel: ".overview__comp--value",
      uncompLabel: ".overview__uncomp--value"
    };

    const createNextList = () => {
      const html = `<li class="next"><div class="item__add"><ion-icon name="add" class="item__add--icon"></ion-icon>
                    </div><div class="item__container"><input type="text" class="item__description" /></div></li>`;
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
      document.querySelector(DOM.addBtn).addEventListener("click", ctrlAddTodo);
      document.addEventListener("keydown", event => {
        if (event.key === "Enter") {
          event.preventDefault();
          ctrlAddTodo();
        }
      });
      document
        .querySelector(DOM.todosContainer)
        .addEventListener("click", ctrlDeleteTodo);
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
      // 1: Get todo's id
      const ID = parseInt(event.target.classList.item(1));

      // 2: Delete todo obj from data structure
      todosCtrl.deleteTodoItem(ID);

      // 3: Delete todo from UI
      // 4: Update and show overview
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
