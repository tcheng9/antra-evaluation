//console.log("hello world")

/*
  client side
    template: static template
    logic(js): MVC(model, view, controller): used to server side technology, single page application
        model: prepare/manage data,
        view: manage view(DOM),
        controller: business logic, event bindind/handling

  server side
    json-server
    CRUD: create(post), read(get), update(put, patch), delete(delete)

*/

//read
/* fetch("http://localhost:3000/todos")
    .then((res) => res.json())
    .then((data) => {
        console.log(data);
    }); */

    const APIs = (() => {
      const createTodo = (newTodo) => {
        return fetch("http://localhost:3000/todos", {
          method: "POST",
          body: JSON.stringify(newTodo),
          headers: { "Content-Type": "application/json" }
        }).then((res) => res.json());
      };

      const deleteTodo = (id) => {
        return fetch("http://localhost:3000/todos/" + id, {
          method: "DELETE"
        }).then((res) => res.json());
      };

      const getTodos = () => {
        return fetch("http://localhost:3000/todos").then((res) => res.json());
      };

      const updateTodo = (id, newTodo) => {
        return fetch("http://localhost:3000/todos/" + id, {
          method: "PUT",

          body: JSON.stringify(newTodo),
          headers: { "Content-Type": "application/json" }
        }).then((res) => res.json());
      };

      return { createTodo, deleteTodo, getTodos, updateTodo };
    })();

    //IIFE
    //todos
    /*
          hashMap: faster to search
          array: easier to iterate, has order

      */
    const Model = (() => {
      class State {
        #todos; //private field
        #onChange; //function, will be called when setter function todos is called
        constructor() {
          this.#todos = [];
        }
        get todos() {
          return this.#todos;
        }
        set todos(newTodos) {
          // reassign value
          console.log("setter function");
          this.#todos = newTodos;
          this.#onChange?.(); // rendering
        }

        subscribe(callback) {
          //subscribe to the change of the state todos
          this.#onChange = callback;
        }
      }
      const { getTodos, createTodo, deleteTodo, updateTodo } = APIs;
      return {
        State,
        getTodos,
        createTodo,
        deleteTodo,
        updateTodo
      };
    })();
    /*
          todos = [
              {
                  id:1,
                  content:"eat lunch"
              },
              {
                  id:2,
                  content:"eat breakfast"
              }
          ]

      */
    const View = (() => {
      // const todolistEl = document.querySelector(".todo-list");
      const submitBtnEl = document.querySelector(".submit-btn");
      const inputEl = document.querySelector(".input");

      ////////////////Swapping to my own pending todo
      const todoListEl = document.querySelector(".todo-wrapper");
      const pendingListEl = document.querySelector(".pending");
      const completeListEl = document.querySelector(".complete");
      const renderTodos = (todos) => {
        let pendingTemplate = "";
        let completeTemplate = "";

        todos.forEach((todo) => {
          if (!todo.complete) {
            console.log("false");
            const liTemplate = `
                      <li>
                          <span id = "text${todo.id}" contentEditable=True>
                              ${todo.content}
                          </span>
                          <button class="edit-btn" id="${todo.id}">
                              edit
                          </button>
                          <button class="complete-btn" id="${todo.id}">
                              Move to Complete
                          </button>
                          <button class="delete-btn" id="${todo.id}">
                              delete
                          </button>
                      </li>`;
            pendingTemplate += liTemplate;
          } else {
            // complete === True
            console.log("true");
            const completeLiTemplate = `
                      <li>
                          <span id = "text${todo.id}" contentEditable=True>
                              ${todo.content}
                          </span>
                          <button class="edit-btn" id="${todo.id}">
                              edit
                          </button>
                          <button class="pending-btn" id="${todo.id}">
                              Move to Pending
                          </button>
                          <button class="delete-btn" id="${todo.id}">
                              delete
                          </button>
                      </li>`;
            completeTemplate += completeLiTemplate;
          }
        });
        pendingListEl.innerHTML = pendingTemplate;
        completeListEl.innerHTML = completeTemplate;

        //add placeholder text if no todos
        if (todos.length === 0) {
          todosTemplate = "<h4>no task to display!</h4>";
        }
        // pendingListEl.innerHTML = todosTemplate;
      };

      const clearInput = () => {
        inputEl.value = "";
      };

      return {
        renderTodos,
        submitBtnEl,
        inputEl,
        clearInput,
        pendingListEl,
        completeListEl,
        todoListEl
      };
    })();

    const Controller = ((view, model) => {
      const state = new model.State();
      const init = () => {
        model.getTodos().then((todos) => {
          todos.reverse();
          state.todos = todos;
        });
      };

      const handleSubmit = () => {
        view.submitBtnEl.addEventListener("click", (event) => {
          /*
                      1. read the value from input
                      2. post request
                      3. update view
                  */
          //    console.log("submit");
          const inputValue = view.inputEl.value;
          model
            .createTodo({ content: inputValue, complete: false })
            .then((data) => {
              state.todos = [data, ...state.todos];
              view.clearInput();
            });
        });
      };

      const handleDelete = () => {
        //event bubbling
        /*
                  1. get id
                  2. make delete request
                  3. update view, remove
              */
        view.pendingListEl.addEventListener("click", (event) => {
          if (event.target.className === "delete-btn") {
            console.log("delete");
            const id = event.target.id;
            console.log("id", typeof id);
            model.deleteTodo(+id).then((data) => {
              state.todos = state.todos.filter((todo) => todo.id !== +id);
            });
          }
        });

        view.completeListEl.addEventListener("click", (event) => {
          if (event.target.className === "delete-btn") {
            console.log("delete");
            const id = event.target.id;
            console.log("id", typeof id);
            model.deleteTodo(+id).then((data) => {
              state.todos = state.todos.filter((todo) => todo.id !== +id);
            });
          }
        });
      };
      //swap completed boolean
      const changeProgress = () => {
          view.pendingListEl.addEventListener("click", (event) => {

              if (event.target.className === "complete-btn"){

                  console.log("swap sides");
                  const id = event.target.id;
                  console.log(id);

                  const content = document.getElementById("text"+id)
                  console.log(content.innerText);

                  let exObj = {
                      content: content.innerText,
                      complete:true,
                      id:id,
                  }
                  model.updateTodo(+id, exObj).then((data) => {
                      console.log('running');
                      state.todos = [data, ...state.todos];
                      view.clearInput();

                  });
              }
          })
      }

      const changeComplete = () => {
          view.completeListEl.addEventListener("click", (event) => {

              if (event.target.className === "pending-btn"){

                  console.log("swap sides");
                  const id = event.target.id;
                  console.log(id);

                  const content = document.getElementById("text"+id)
                  console.log(content.innerText);

                  let exObj = {
                      content: content.innerText,
                      complete:false,
                      id:id,
                  }
                  model.updateTodo(+id, exObj).then((data) => {
                      console.log('running');
                      state.todos = [data, ...state.todos];
                      view.clearInput();

                  });
              }

          })
      }

      //Toggle edit button

        const editText = () => {
            //pending list
            view.pendingListEl.addEventListener("click", (event) => {
              const id = event.target.id;
              if ((event.target.className = "pending-edit-btn")) {
                console.log("swap sides");
                const id = event.target.id;
                console.log(id);

                const content = document.getElementById("text" + id);
                console.log(content.innerText);

                let exObj = {
                  content: content.innerText,
                  complete: false,
                  id: id
                };
                model.updateTodo(+id, exObj).then((data) => {
                  console.log("running");
                  state.todos = [data, ...state.todos];
                  view.clearInput();
                });
              }
            });

            ///Complete list
            view.completeListEl.addEventListener("click", (event) => {
              if ((event.target.className = "complete-edit-btn")) {
                const id = event.target.id;

                const content = document.getElementById("text" + id);

                let exObj = {
                  content: content.innerText,
                  complete: true,
                  id: id
                };

                console.log(exObj);
                model.updateTodo(+id, exObj).then((data) => {
                  console.log("running");
                  state.todos = [data, ...state.todos];
                  view.clearInput();
                });
              }
            });
          };

      const bootstrap = () => {
        init();
        handleSubmit();
        handleDelete();
        state.subscribe(() => {
          view.renderTodos(state.todos);
        });
        changeProgress();
        editText();
        changeComplete();
      };
      return {
        bootstrap
      };
    })(View, Model); //ViewModel

    Controller.bootstrap();
