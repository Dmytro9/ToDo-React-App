var Task = React.createClass({

    render: function() {
        return (
            <li className={this.props.forClass} >
                <span className="img-task" onClick={this.props.onTaskComplete}></span>
                {this.props.children}
                <span className="remove-task" onClick={this.props.onTaskDelete}>×</span>
            </li>
        )
    }
});


var Lists = React.createClass({


    render: function() {
        var onComplete = this.props.onTaskComplete;
        var onTaskDelete = this.props.onTaskDelete;

        return (
            <ul className="list-items">
                {
                    this.props.list.map(function(task){
                        return (
                            <Task
                                key={task.id}
                                onTaskComplete={onComplete.bind(null, task)}
                                onTaskDelete={onTaskDelete.bind(null, task)}
                                forClass={task.status}
                            >
                                {task.text}
                            </Task>
                        );
                    })
                }
            </ul>
        )
    }
});



var ListEditor = React.createClass({

    getInitialState: function() {
        return {
            text: ''
        }
    },

    handleTextChange: function(e) {
        this.setState({text: e.target.value});
    },

    handleTaskAdd: function(e) {

        if ( e.keyCode == 13 ) {

            var newTask = {
                text: this.state.text,
                id: Date.now(),
                status: false
            };

            if (newTask.text.trim().length > 0) {
                this.props.onTaskAdd(newTask);
                this.setState({text: ''});
            } else {
                return false;
            }
        }
    },

    render: function() {
        return (
            <input
                type="text"
                placeholder='What you need to do?'
                value={this.state.text}
                onKeyUp={this.handleTaskAdd}
                onChange={this.handleTextChange} />
        )
    }
});



var SortItem = React.createClass({

    render: function() {

        var sortBtn = ['all', 'new', 'completed'],
            handleTaskSort = this.props.doSort,
            currentFilter = this.props.currentFilter;

        return (
            <div className="sort-items">
                {
                    sortBtn.map(item =>
                        <span
                            key={item}
                            className={item === currentFilter ? 'active' : ''}
                            onClick={handleTaskSort.bind(null, item)}
                        >
                            {item}
                        </span>
                    )
                }
            </div>
        )
    }
});


var ToDoApp = React.createClass({

    getInitialState: function() {
        return {
            list: [],
            filter: 'all'
        };
    },

    componentDidMount: function() {
        var list = JSON.parse(localStorage.getItem('list'));

        if (list) {
            this.setState({
                list: list
            });
        }
    },

    componentDidUpdate: function() {
        this._updateLocalStorage();
    },

    handleTaskAdd: function(newTask) {

        var newList = this.state.list.slice();

        newList.unshift(newTask);
        this.setState({
            list: newList
        });
    },

    handleTaskComplete: function(task) {
        var newTasks = this.state.list.slice();

        newTasks.forEach(function(el) {
            if (el.id === task.id) {
                el.status = !task.status
            }
        });

        this.setState({
            list: newTasks
        });
    },

    handleTaskDelete: function(el) {
        var newTasks = this.state.list.slice();

        var newList = newTasks.filter(function(task) {
            return  task.id !== el.id;
        });

        this.setState({
            list: newList
        });
    },

    handleTaskSort: function(filter) {
        this.setState({
            filter: filter
        });
    },

    render: function() {
        return (
        <div className="todo-app">

            <ListEditor onTaskAdd={this.handleTaskAdd} />
            <Lists list={this.state.list}
                   onTaskComplete={this.handleTaskComplete}
                   onTaskDelete={this.handleTaskDelete}
                   list={this._getVisibleToDos(this.state.list, this.state.filter)} />
            <SortItem doSort={this.handleTaskSort}
                      currentFilter={this.state.filter}  />
        </div>
        );
    },

    _getVisibleToDos(list, filter) {

        switch(filter) {

            case "completed":
                return list.filter(task => task.status);
                break;

            case "new":
                return list.filter(task => !task.status);
                break;

            default:
                return list
        }
    },

    _updateLocalStorage: function() {

        var list = JSON.stringify(this.state.list);
        localStorage.setItem('list', list);
    }

});


ReactDOM.render(
<ToDoApp />,
    document.getElementById('to_do')
);
