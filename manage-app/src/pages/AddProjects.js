import React, {Component} from 'react';
import TextField from 'material-ui/TextField'
import { FormControl } from 'material-ui/Form';
import Checkbox from 'material-ui/Checkbox';
import { ListItemText } from 'material-ui/List';
import Select from 'material-ui/Select';
import Input, { InputLabel } from 'material-ui/Input';
import MenuItem from 'material-ui/Menu/MenuItem';
import Snackbar from 'material-ui/Snackbar';
import Button from 'material-ui/Button';
import { Redirect } from 'react-router-dom';

const style = {
  div: {
    margin: 'auto',
    width: '15%',
    padding: '10px'
  },
  customWidth: {
    margin: 'auto',
    width: '100%'
  }
}

class AddProjects extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      openError: false,
      name: '',
      redirect: false,
      tag: new Set(),
      values: []
    }
  }

  componentDidMount() {
    fetch('https://reactmanagebe.herokuapp.com/api/users', {credentials: 'include'})
      .then( response => response.json())
      .then( data => this.setState({values: data}))
      .catch(err => {
        if (err == 'TypeError: Failed to fetch') return this.setState({redirectLogin: true})
      })
  }

  handleRequestClose = () => {
    this.setState({
      open: false,
      openError: false
    });
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  handleTagChange = event => {
    this.setState({ tag: new Set(event.target.value) });
  };

  render(){
    const { redirect } = this.state
    const { redirectLogin } = this.state

    if (redirectLogin) {
      return (
        <Redirect to={{pathname: '/login' }}/>
      )
    }
    if (redirect) {
      return (
        <Redirect to={{pathname: '/projects' }}/>
      )
    }

    let changeSnackBar = () => {
      this.setState({
        open: true,
      });
      setTimeout(() => {this.setState({redirect: true})} ,1000)
    }

    let changeSnackBarToError = () => {
      this.setState({
        openError: true,
      });
    }

    let changeSnackBarToName = () => {
      this.setState({
        openErrorName: true,
      });
    }

    let changeSnackBarToAmount = () => {
      this.setState({
        openErrorAmount: true,
      });
    }

    let object = {
      name: this.state.name,
      amount: this.state.amount,
      users: this.state.tag
    }
    
    let doSomething = () => {
      if (!object.name) return changeSnackBarToName()
      if (!object.amount) return changeSnackBarToAmount()

      if (!this.state.tag) {
        object.users = []
      }
      else {
        console.log(this.state.tag)
        let array = Array.from(this.state.tag);
        object.users = array
      }
      fetch('https://reactmanagebe.herokuapp.com/api/projects',
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          method: "POST",
          credentials: 'include',
          body: JSON.stringify(object)
        }
      ).then(response => {
        if (!response.ok){
          throw Error(response.statusText)
        }
        return response
      }).then(changeSnackBar)
        .catch(changeSnackBarToError)
    }

    return (
      <div style={style.div}>
          <TextField
            id="name"
            label="Nazwa projektu"
            placeholder="Np.BPC"
            margin="normal"
            required={true}
            onChange={this.handleChange('name')}
          />
          
          <TextField
            id="number"
            label="Kwota"
            type="number"
            InputLabelProps={{
              shrink: true
            }}
            margin="normal"
            onChange={this.handleChange('amount')}
          />
          
          <FormControl style={{minWidth:166, maxWidth: 166}}>
          <InputLabel htmlFor="tag-multiple">Uzytkownicy</InputLabel>
          <Select
            multiple
            value={[...this.state.tag]}
            onChange={this.handleTagChange}
            input={<Input id="tag-multiple" />}
            renderValue={selected => selected.join(', ')}
          >
            {this.state.values.map(tag => (
              <MenuItem key={tag.id} value={tag._id}>
                <Checkbox checked={this.state.tag.has(tag._id)} />
                <ListItemText primary={tag.name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

          <Button color="primary" style={{marginLeft:'4.7%', marginTop:'10px'}} onClick={doSomething}>
            Dodaj projekt
          </Button>
      
          <Snackbar
            open={this.state.open}
            message="Dodano projekt"
            autoHideDuration={2000}
            onClose={this.handleRequestClose}
          />

          <Snackbar
            open={this.state.openError}
            message="Bląd podczas dodawania"
            autoHideDuration={2000}
            onClose={this.handleRequestClose}
          />

          <Snackbar
            open={this.state.openErrorName}
            message="Nie wpisano nazwy"
            autoHideDuration={1000}
          />
          
          <Snackbar
            open={this.state.openErrorAmount}
            message="Nie wpisano kwoty"
            autoHideDuration={1000}
          />
      </div>
    )
  }
}

export default AddProjects;