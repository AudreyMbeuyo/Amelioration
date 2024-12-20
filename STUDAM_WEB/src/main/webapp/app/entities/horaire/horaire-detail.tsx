import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { TextFormat, Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './horaire.reducer';

export const HoraireDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const horaireEntity = useAppSelector(state => state.horaire.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="horaireDetailsHeading">
          <Translate contentKey="studamWebApp.horaire.detail.title">Horaire</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{horaireEntity.id}</dd>
          <dt>
            <span id="jour">
              <Translate contentKey="studamWebApp.horaire.jour">Jour</Translate>
            </span>
          </dt>
          <dd>{horaireEntity.jour}</dd>
          <dt>
            <span id="heureDebut">
              <Translate contentKey="studamWebApp.horaire.heureDebut">Heure Debut</Translate>
            </span>
          </dt>
          <dd>{horaireEntity.heureDebut ? <TextFormat value={horaireEntity.heureDebut} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>
            <span id="heureFin">
              <Translate contentKey="studamWebApp.horaire.heureFin">Heure Fin</Translate>
            </span>
          </dt>
          <dd>{horaireEntity.heureFin ? <TextFormat value={horaireEntity.heureFin} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
        </dl>
        <Button tag={Link} to="/horaire" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/horaire/${horaireEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default HoraireDetail;
