import React, { Component } from 'react';
import { FaGithub, FaPlus, FaSpinner, FaSearch } from 'react-icons/fa';
import { GiBatMask } from 'react-icons/gi';
import { Link } from 'react-router-dom';

import api from '../../services/api';

import Container from '../../components/Container';

import { Form, SubmitButton, List } from './styles';


export default class Main extends Component {

  //cria as variáveis de estado
  state = {
    newHero: '',
    heros: [],
    loading: false
  };

  //carrega os dados do localStorage
  componentDidMount(){
    const heros = localStorage.getItem('heros');

    if(heros){
      this.setState({ heros: JSON.parse(heros)});
    }
  }

  //salva os dados no localStorage
  componentDidUpdate(_, prevState){
    const { heros } = this.state;

    if( prevState.heros !== heros ){
      localStorage.setItem('heros', JSON.stringify(heros));
    }
  }


  //responsável por tratar o onchange do input
  handleInputChange = e => {
    this.setState({ newHero: e.target.value });
  };

  //responsável por tratar o onsubmit do form
  handleSubmit = async e => {
    e.preventDefault();

    this.setState({ loading: true})

    const { newHero, heros } = this.state;

    const response = await api.get(`/search/${newHero}`);

    const data = {
      id: response.data.results[0].id,
      name: response.data.results[0].name
    };

    this.setState({
      heros: [ ...heros, data],
      newHero: '',
      loading: false
    });
  }

  //responsável por renderizar os componentes
  render (){
    const { newHero, loading, heros } = this.state;
    return (
      <Container>
        <h1>
          <GiBatMask />
          Encontre um Super-Herói
        </h1>

        <Form onSubmit={this.handleSubmit}>
          <input
            type="text"
            placeholder="Buscar super-herói"
            value={newHero}
            onChange={this.handleInputChange}
            />

          <SubmitButton loading={loading}>
            { loading ?
            <FaSpinner color="#fff" size={14} /> :
            <FaSearch color="#fff" size={14} />
            }
          </SubmitButton>
        </Form>
        <List>
          {
            heros.map( hero => (
              <li key={hero.id}>
                <span>{hero.name}</span>
                <Link to={`/hero/${encodeURIComponent(hero.id)}/${encodeURIComponent(hero.name)}`}>Ver mais</Link>
              </li>
            ))
          }
        </List>
      </Container>
    );
  }
}
