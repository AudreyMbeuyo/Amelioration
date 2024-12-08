import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { TextFormat, Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './estpresent.reducer';

export const EstpresentDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const estpresentEntity = useAppSelector(state => state.estpresent.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="estpresentDetailsHeading">
          <Translate contentKey="studamWebApp.estpresent.detail.title">Estpresent</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{estpresentEntity.id}</dd>
          <dt>
            <span id="date">
              <Translate contentKey="studamWebApp.estpresent.date">Date</Translate>
            </span>
          </dt>
          <dd>{estpresentEntity.date ? <TextFormat value={estpresentEntity.date} type="date" format={APP_LOCAL_DATE_FORMAT} /> : null}</dd>
          <dt>
            <Translate contentKey="studamWebApp.estpresent.horaire">Horaire</Translate>
          </dt>
          <dd>{estpresentEntity.horaire ? estpresentEntity.horaire.id : ''}</dd>
          <dt>
            <Translate contentKey="studamWebApp.estpresent.etudiant">Etudiant</Translate>
          </dt>
          <dd>{estpresentEntity.etudiant ? estpresentEntity.etudiant.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/estpresent" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/estpresent/${estpresentEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default EstpresentDetail;
