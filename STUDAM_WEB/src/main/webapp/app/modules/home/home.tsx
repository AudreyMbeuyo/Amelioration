import './home.scss';
import { Alert, Col, Row, Button, Collapse, CardBody, Card } from 'reactstrap';

import { useAppSelector } from 'app/config/store';
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Table } from 'reactstrap';
import { Translate, getSortState } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons';
import { ASC, DESC } from 'app/shared/util/pagination.constants';
import { overrideSortStateWithQueryParams } from 'app/shared/util/entity-utils';
import { useAppDispatch } from 'app/config/store';

import { getEntities } from '../../entities/matiere/matiere.reducer';

export const Home = () => {
  const account = useAppSelector(state => state.authentication.account);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');

  // Fonction pour gérer l'ouverture des sous-menus
  const toggle = () => setIsOpen(!isOpen);

  // Fonction pour gérer la sélection de l'option (matière ou classe)
  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    setIsOpen(false); // Fermer le menu après sélection
  };
  const dispatch = useAppDispatch();

  const pageLocation = useLocation();
  const navigate = useNavigate();

  const [sortState, setSortState] = useState(overrideSortStateWithQueryParams(getSortState(pageLocation, 'id'), pageLocation.search));

  const matiereList = useAppSelector(state => state.matiere.entities);
  const loading = useAppSelector(state => state.matiere.loading);

  const getAllEntities = () => {
    dispatch(
      getEntities({
        sort: `${sortState.sort},${sortState.order}`,
      }),
    );
  };

  const sortEntities = () => {
    getAllEntities();
    const endURL = `?sort=${sortState.sort},${sortState.order}`;
    if (pageLocation.search !== endURL) {
      navigate(`${pageLocation.pathname}${endURL}`);
    }
  };

  useEffect(() => {
    sortEntities();
  }, [sortState.order, sortState.sort]);

  const sort = p => () => {
    setSortState({
      ...sortState,
      order: sortState.order === ASC ? DESC : ASC,
      sort: p,
    });
  };

  const handleSyncList = () => {
    sortEntities();
  };

  const getSortIconByFieldName = (fieldName: string) => {
    const sortFieldName = sortState.sort;
    const order = sortState.order;
    if (sortFieldName !== fieldName) {
      return faSort;
    }
    return order === ASC ? faSortUp : faSortDown;
  };

  return (
    <Row>
      <Col md="3" className="pad">
        <span className="hipster rounded" />
      </Col>
      <Col md="9">
        {account?.login ? (
          <div>
            <h1 className="display-4">
              <Translate contentKey="home.title">Bienvenue, {account.login} !</Translate>
            </h1>
            <p className="lead">Que voulez-vous faire aujourd&apos;hui ?</p>

            {/* Boutons pour afficher les sous-menus */}
            <Button color="primary" onClick={toggle} style={{ marginBottom: '1rem' }}>
              Choisir une option
            </Button>

            <Collapse isOpen={isOpen}>
              <Card>
                <CardBody>
                  <Button color="info" block onClick={() => handleOptionSelect('matiere')}>
                    Afficher par matière
                  </Button>
                  <Button color="info" block onClick={() => handleOptionSelect('classe')} style={{ marginTop: '10px' }}>
                    Afficher par classe
                  </Button>
                </CardBody>
              </Card>
            </Collapse>

            {/* Affichage du contenu en fonction de l'option sélectionnée */}
            {selectedOption === 'matiere' && (
              <div>
                <h3>Vous avez choisi d&apos;afficher par matière.</h3>
                {
                  /* Affichez ici les matières du professeur */
                  <div className="table-responsive">
                    {matiereList && matiereList.length > 0 ? (
                      <Table responsive>
                        <thead>
                          <tr>
                            <th className="hand" onClick={sort('id')}>
                              <Translate contentKey="studamWebApp.matiere.id">ID</Translate>{' '}
                              <FontAwesomeIcon icon={getSortIconByFieldName('id')} />
                            </th>
                            <th className="hand" onClick={sort('libelle')}>
                              <Translate contentKey="studamWebApp.matiere.libelle">Libelle</Translate>{' '}
                              <FontAwesomeIcon icon={getSortIconByFieldName('libelle')} />
                            </th>
                            <th className="hand" onClick={sort('code')}>
                              <Translate contentKey="studamWebApp.matiere.code">Code</Translate>{' '}
                              <FontAwesomeIcon icon={getSortIconByFieldName('code')} />
                            </th>
                            <th>
                              <Translate contentKey="studamWebApp.matiere.horaire">Horaire</Translate> <FontAwesomeIcon icon="sort" />
                            </th>
                            <th>
                              <Translate contentKey="studamWebApp.matiere.enseignant">Enseignant</Translate> <FontAwesomeIcon icon="sort" />
                            </th>
                            <th>
                              <Translate contentKey="studamWebApp.matiere.classe">Classe</Translate> <FontAwesomeIcon icon="sort" />
                            </th>
                            <th>
                              <Translate contentKey="studamWebApp.matiere.etudiant">Etudiant</Translate> <FontAwesomeIcon icon="sort" />
                            </th>
                            <th />
                          </tr>
                        </thead>
                        <tbody>
                          {matiereList.map((matiere, i) => (
                            <tr key={`entity-${i}`} data-cy="entityTable">
                              <td>
                                <Button tag={Link} to={`/matiere/${matiere.id}`} color="link" size="sm">
                                  {matiere.id}
                                </Button>
                              </td>
                              <td>{matiere.libelle}</td>
                              <td>{matiere.code}</td>
                              <td>{matiere.horaire ? <Link to={`/horaire/${matiere.horaire.id}`}>{matiere.horaire.id}</Link> : ''}</td>
                              <td>
                                {matiere.enseignant ? <Link to={`/enseignant/${matiere.enseignant.id}`}>{matiere.enseignant.id}</Link> : ''}
                              </td>
                              <td>
                                {matiere.classes
                                  ? matiere.classes.map((val, j) => (
                                      <span key={j}>
                                        <Link to={`/classe/${val.nom}`}>{val.nom}</Link>
                                        {j === matiere.classes.length - 1 ? '' : ', '}
                                      </span>
                                    ))
                                  : null}
                              </td>
                              <td>
                                {matiere.etudiants
                                  ? matiere.etudiants.map((val, j) => (
                                      <span key={j}>
                                        <Link to={`/etudiant/${val.id}`}>{val.id}</Link>
                                        {j === matiere.etudiants.length - 1 ? '' : ', '}
                                      </span>
                                    ))
                                  : null}
                              </td>
                              <td className="text-end">
                                <div className="btn-group flex-btn-group-container">
                                  <Button tag={Link} to={`/matiere/${matiere.id}`} color="info" size="sm" data-cy="entityDetailsButton">
                                    <FontAwesomeIcon icon="eye" />{' '}
                                    <span className="d-none d-md-inline">
                                      <Translate contentKey="entity.action.view">View</Translate>
                                    </span>
                                  </Button>
                                  <Button
                                    tag={Link}
                                    to={`/matiere/${matiere.id}/edit`}
                                    color="primary"
                                    size="sm"
                                    data-cy="entityEditButton"
                                  >
                                    <FontAwesomeIcon icon="pencil-alt" />{' '}
                                    <span className="d-none d-md-inline">
                                      <Translate contentKey="entity.action.edit">Edit</Translate>
                                    </span>
                                  </Button>
                                  <Button
                                    onClick={() => (window.location.href = `/matiere/${matiere.id}/delete`)}
                                    color="danger"
                                    size="sm"
                                    data-cy="entityDeleteButton"
                                  >
                                    <FontAwesomeIcon icon="trash" />{' '}
                                    <span className="d-none d-md-inline">
                                      <Translate contentKey="entity.action.delete">Delete</Translate>
                                    </span>
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    ) : (
                      !loading && (
                        <div className="alert alert-warning">
                          <Translate contentKey="studamWebApp.matiere.home.notFound">No Matieres found</Translate>
                        </div>
                      )
                    )}
                  </div>
                }
              </div>
            )}

            {selectedOption === 'classe' && (
              <div>
                <h3>Vous avez choisi d&apos;afficher par classe.</h3>
                {/* Affichez ici les classes du professeur */}
              </div>
            )}
          </div>
        ) : (
          <div>
            <Alert color="warning">
              <Translate contentKey="global.messages.info.authenticated.prefix">Si vous souhaitez</Translate>

              <Link to="/login" className="alert-link">
                <Translate contentKey="global.messages.info.authenticated.link"> vous connecter</Translate>
              </Link>
              <Translate contentKey="global.messages.info.authenticated.suffix">
                , vous pouvez essayer les comptes par défaut :
                <br />- Administrateur (login=&quot;admin&quot; et mot de passe=&quot;admin&quot;)
                <br />- Utilisateur (login=&quot;user&quot; et mot de passe=&quot;user&quot;).
              </Translate>
            </Alert>

            <Alert color="warning">
              <Translate contentKey="global.messages.info.register.noaccount">Vous n&apos;avez pas encore de compte ?</Translate>&nbsp;
              <Link to="/account/register" className="alert-link">
                <Translate contentKey="global.messages.info.register.link">Inscrivez-vous</Translate>
              </Link>
            </Alert>
          </div>
        )}
      </Col>
    </Row>
  );
};

export default Home;
