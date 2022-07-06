// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

contract Todos{
    struct Todo{
        string text;
        bool done;
    }
    Todo[] todos;
    /*
    create
    read
    update
    -change text
    -change state
    delete
    */

    function create(string calldata _text) external {
        todos.push(Todo(_text,false));
    }

    function get(uint _i) external view returns (string memory ,bool ){
        Todo storage todo = todos[_i];
        return (todo.text,todo.done);
    }

    function update(uint _i,string calldata _t) external{
        todos[_i].text = _t; 
    }

    function toggle(uint _i) external {
        todos[_i].done = !todos[_i].done;
    }

    function remove(uint _i) external{
        todos[_i] = todos[todos.length-1];
        todos.pop();
    }



}

