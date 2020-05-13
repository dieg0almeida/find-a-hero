import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import api from '../../services/api';

import Container from '../../components/Container';
import { Owner, Loading, IssueList } from './styles';

export default class Hero extends Component{
  static propTypes = {
    match: PropTypes.shape(
      {
        params: PropTypes.shape(
          {
            hero_id: PropTypes.string
          },
          {
            hero_name: PropTypes.string
          }
        )
      }
    ).isRequired
  };

  state = {
    hero: {},
    heros: [],
    loading: true
  };

  async componentDidMount(){
    const { match } = this.props;

    const hero_id = decodeURIComponent(match.params.hero_id);
    const hero_name = decodeURIComponent(match.params.hero_name);

    console.log(hero_id);
    console.log(hero_name);
    const [ hero, heros ] = await Promise.all(
      [
        api.get(`/${hero_id}`),
        api.get(`/search/${hero_name}`, {
          params: {
            state: 'open',
            per_page: 5
          }
        })
      ]
    );

    console.log(hero.data);
    console.log(heros.data);


    this.setState({
      hero: hero.data,
      heros: heros.data.results,
      loading: false
    });
  }

  render(){
    const { hero, heros, loading } = this.state;

    if(loading){
      return <Loading>Carregando...</Loading>
    }
    return <Container>
      <Owner>
        <Link to="/">Voltar aos super-heróis</Link>
        <img src={hero.image.url} alt={hero.name} />
        <h1>{hero.name}</h1>
        <p>Inteligência: {hero.powerstats.intelligence} <br/>
        Força: {hero.powerstats.strength}<br/>
        Velocidade: {hero.powerstats.speed}<br/>
        Durabilidade: {hero.powerstats.durability}<br/>
        Poder: {hero.powerstats.power}<br/>
        Combate: {hero.powerstats.combat}</p>
      </Owner>

      <IssueList>
        {
          heros.map(hero => {
            hero.search = `http://www.google.com/search?q=${hero.name}`;
            return (
              <li key={String(hero.id)}>
              <img src={hero.image.url} alt={hero.name} />
              <div>
                <strong>
                  <a href={hero.search} target="_blank" >Afiliações: {hero.connections.relatives}</a>
                </strong>
                <p>{hero.name}</p>
              </div>
              </li>
            )
          })
        }
      </IssueList>
    </Container>;
  }
}
