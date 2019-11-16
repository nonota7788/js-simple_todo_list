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

    Todos.prototype.getUncompTodo = function() {
      if (this.done === "uncomp") return this;
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

        //4: retrun Todo instance
        return newItem;
      },

      getTodosTotal: function() {
        return data.todoItems.length;
      },

      calculateOverview: function() {
        // 1: Calaculate todos'total number
        data.overview.total = this.getTodosTotal();

        // 2: Calaculate todos'uncomp number
        const uncomp = data.todoItems.map(cur => {
          return cur.getUncompTodo();
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

      displayTodoItem: function(item, num) {
        //1: Create html
        const html = `<li class="item" id=${item.id}> <div class="item__done"><button type="button" class="item__done--btn ${item.done}"></button></div>
                      <div class="item__container"><input type="text" class="item__description" value=${item.description} /><div class="item__delete">
                      <button type="button" class="item__delete--btn"><ion-icon name="close-circle-outline" class="item--delete--icon"></ion-icon>
                      </button></div></div></li>`;

        //2: Insert html(new todo item)
        const target = document.querySelector(DOMstrings.nextItem);
        target.insertAdjacentHTML("beforebegin", html);

        //4: Clear 'next' input value
        document.querySelector(DOMstrings.nextItemDesc).value = "";

        //5: Remove one 'blank' list from UI
        if (num < 5) {
          const deleteTarget = document.querySelector(DOMstrings.blankItem);
          target.parentNode.removeChild(deleteTarget);
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
    const setupEventListener = () => {
      const DOM = UICtrl.getDOMstrings();
      document.querySelector(DOM.addBtn).addEventListener("click", ctrlAddTodo);
      document.addEventListener("keydown", event => {
        if (event.key === "Enter") {
          event.preventDefault();
          ctrlAddTodo(event);
        }
      });
    };

    const updateOverview = () => {
      // 1: calculate overview (total, uncomp, comp)
      todosCtrl.calculateOverview();

      // 2: Get overview
      const overview = todosCtrl.getOverview();

      // 3: update todos's overview
      UICtrl.displayOverview(overview);
    };

    const ctrlAddTodo = event => {
      // 1: get input value from the UI
      const input = UICtrl.getInput();

      if (input) {
        // 2: add input value to data structure
        const todoItem = todosCtrl.addTodoItem(input);

        // 3: Calculate number of todo items
        const todoNum = todosCtrl.getTodosTotal();

        // 4: display todo item using input value
        UICtrl.displayTodoItem(todoItem, todoNum);

        // 5: Calculate and update todo's overview
        updateOverview();
      }
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
        setupEventListener();
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
