var FilterList = React.createClass({

    render: function() {
        return (
            <div className="filter-list">
                <span className="active" onClick={this.props.showAll}>All</span>
                <span onClick={this.props.showNew}>New</span>
                <span onClick={this.props.showCompleted}>Completed</span>
            </div>
        )
    }
});

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
        var onComplete = this.props.onTaskComplete,
            onTaskDelete = this.props.onTaskDelete;

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




var ToDoApp = React.createClass({

    getInitialState: function() {
        return {
            list: [],
            listBackUp: []
        };
    },

    componentDidMount: function() {
        var list = JSON.parse(localStorage.getItem('list')),
            listBackUp = JSON.parse(localStorage.getItem('listBackUp'));

        if (list) {
            this.setState({
                list: list,
                listBackUp: listBackUp
            });
        }
    },

    componentDidUpdate: function() {
        if (!this.newList) {
            this._updateLocalStorage();
        }
    },

    handleTaskAdd: function(newTask) {

        var newList = this.state.list.slice();

        newList.unshift(newTask);
        this.setState({
            list: newList,
            listBackUp: newList
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

    handleTaskDelete: function(task) {
        var taskId = task.id;

        var newList = this.state.list.filter(function(task){
            return  task.id !== taskId;
        });

        this.setState({
            list: newList
        });
    },

    handleShowCompleted: function() {
        if (!this.copyList) {
            this.copyList = this.state.list.slice();
        }

        var newTask = this.copyList.filter(function(task) {
            return task.status;
        });

        this.setState({
            list: newTask
        });
        console.log( 'hello' );
    },


    handleShowNew: function() {
        if (!this.copyList) {
            this.copyList = this.state.list.slice();
        }

        var newTask = this.copyList.filter(function(task) {
                return !task.status;
        });

        this.setState({
            list: newTask
        });
    },

    handleShowAll: function() {
        if (!this.copyList) {
            this.copyList = this.state.list.slice();
        }

        var newTask = this.copyList.slice();
        this.copyList = null;

        this.setState({
            list: newTask
        });
    },

    render: function() {
        return (
        <div className="todo-app">

            <ListEditor onTaskAdd={this.handleTaskAdd} />

            <Lists list={this.state.list}
                   onTaskComplete={this.handleTaskComplete}
                   onTaskDelete={this.handleTaskDelete} />

            <FilterList showCompleted={this.handleShowCompleted}
                        showNew={this.handleShowNew}
                        showAll={this.handleShowAll} />
        </div>
        );
    },

    _updateLocalStorage: function() {

        var list = JSON.stringify(this.state.list),
            listBackUp = JSON.stringify(this.state.listBackUp);

        localStorage.setItem('list', list);
        localStorage.setItem('listBackUp', listBackUp);
    },

});






ReactDOM.render(
<ToDoApp />,
    document.getElementById('to_do')
);
