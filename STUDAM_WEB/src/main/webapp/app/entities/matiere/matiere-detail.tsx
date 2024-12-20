import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './matiere.reducer';

export const MatiereDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const matiereEntity = useAppSelector(state => state.matiere.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="matiereDetailsHeading">
          <Translate contentKey="studamWebApp.matiere.detail.title">Matiere</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{matiereEntity.id}</dd>
          <dt>
            <span id="libelle">
              <Translate contentKey="studamWebApp.matiere.libelle">Libelle</Translate>
            </span>
          </dt>
          <dd>{matiereEntity.libelle}</dd>
          <dt>
            <span id="code">
              <Translate contentKey="studamWebApp.matiere.code">Code</Translate>
            </span>
          </dt>
          <dd>{matiereEntity.code}</dd>
          <dt>
            <Translate contentKey="studamWebApp.matiere.horaire">Horaire</Translate>
          </dt>
          <dd>{matiereEntity.horaire ? matiereEntity.horaire.id : ''}</dd>
          <dt>
            <Translate contentKey="studamWebApp.matiere.enseignant">Enseignant</Translate>
          </dt>
          <dd>{matiereEntity.enseignant ? matiereEntity.enseignant.id : ''}</dd>
          <dt>
            <Translate contentKey="studamWebApp.matiere.classe">Classe</Translate>
          </dt>
          <dd>
            {matiereEntity.classes
              ? matiereEntity.classes.map((val, i) => (
                  <span key={val.id}>
                    <a>{val.id}</a>
                    {matiereEntity.classes && i === matiereEntity.classes.length - 1 ? '' : ', '}
                  </span>
                ))
              : null}
          </dd>
          <dt>
            <Translate contentKey="studamWebApp.matiere.etudiant">Etudiant</Translate>
          </dt>
          <dd>
            {matiereEntity.etudiants
              ? matiereEntity.etudiants.map((val, i) => (
                  <span key={val.id}>
                    <a>{val.id}</a>
                    {matiereEntity.etudiants && i === matiereEntity.etudiants.length - 1 ? '' : ', '}
                  </span>
                ))
              : null}
          </dd>
        </dl>
        <Button tag={Link} to="/matiere" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/matiere/${matiereEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default MatiereDetail;
