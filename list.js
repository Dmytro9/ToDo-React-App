var Task = React.createClass({

    render: function() {
        return (
            <li className="task">
                {this.props.children}
            </li>
        )
    }
});


var Lists = React.createClass({

    render: function() {

        return (
            <ul className="list-items">
                {
                    this.props.list.map(function(task){
                        return (
                            <Task
                                key={task.id}
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
                id: Date.now()
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
        this._updateLocalStorage();
    },

    handleTaskAdd: function(newTask) {

        var newList = this.state.list.slice();

        newList.unshift(newTask);
        this.setState({
            list: newList,
            listBackUp: newList
        });
    },

    render: function() {
        return (
        <div className="todo-app">

            <ListEditor onTaskAdd={this.handleTaskAdd} />
            <Lists list={this.state.list} onTaskDelete={this.handleTaskDelete} />
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
