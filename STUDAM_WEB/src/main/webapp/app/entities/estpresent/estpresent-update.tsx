import React, { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { Translate, ValidatedField, ValidatedForm, translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntities as getHoraires } from 'app/entities/horaire/horaire.reducer';
import { getEntities as getEtudiants } from 'app/entities/etudiant/etudiant.reducer';
import { createEntity, getEntity, reset, updateEntity } from './estpresent.reducer';

export const EstpresentUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const horaires = useAppSelector(state => state.horaire.entities);
  const etudiants = useAppSelector(state => state.etudiant.entities);
  const estpresentEntity = useAppSelector(state => state.estpresent.entity);
  const loading = useAppSelector(state => state.estpresent.loading);
  const updating = useAppSelector(state => state.estpresent.updating);
  const updateSuccess = useAppSelector(state => state.estpresent.updateSuccess);

  const handleClose = () => {
    navigate('/estpresent');
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }

    dispatch(getHoraires({}));
    dispatch(getEtudiants({}));
  }, []);

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
    }
  }, [updateSuccess]);

  const saveEntity = values => {
    if (values.id !== undefined && typeof values.id !== 'number') {
      values.id = Number(values.id);
    }

    const entity = {
      ...estpresentEntity,
      ...values,
      horaire: horaires.find(it => it.id.toString() === values.horaire?.toString()),
      etudiant: etudiants.find(it => it.id.toString() === values.etudiant?.toString()),
    };

    if (isNew) {
      dispatch(createEntity(entity));
    } else {
      dispatch(updateEntity(entity));
    }
  };

  const defaultValues = () =>
    isNew
      ? {}
      : {
          ...estpresentEntity,
          horaire: estpresentEntity?.horaire?.id,
          etudiant: estpresentEntity?.etudiant?.id,
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="studamWebApp.estpresent.home.createOrEditLabel" data-cy="EstpresentCreateUpdateHeading">
            <Translate contentKey="studamWebApp.estpresent.home.createOrEditLabel">Create or edit a Estpresent</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ValidatedForm defaultValues={defaultValues()} onSubmit={saveEntity}>
              {!isNew ? (
                <ValidatedField
                  name="id"
                  required
                  readOnly
                  id="estpresent-id"
                  label={translate('global.field.id')}
                  validate={{ required: true }}
                />
              ) : null}
              <ValidatedField
                label={translate('studamWebApp.estpresent.date')}
                id="estpresent-date"
                name="date"
                data-cy="date"
                type="date"
              />
              <ValidatedField
                id="estpresent-horaire"
                name="horaire"
                data-cy="horaire"
                label={translate('studamWebApp.estpresent.horaire')}
                type="select"
              >
                <option value="" key="0" />
                {horaires
                  ? horaires.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.id}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <ValidatedField
                id="estpresent-etudiant"
                name="etudiant"
                data-cy="etudiant"
                label={translate('studamWebApp.estpresent.etudiant')}
                type="select"
              >
                <option value="" key="0" />
                {etudiants
                  ? etudiants.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.id}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/estpresent" replace color="info">
                <FontAwesomeIcon icon="arrow-left" />
                &nbsp;
                <span className="d-none d-md-inline">
                  <Translate contentKey="entity.action.back">Back</Translate>
                </span>
              </Button>
              &nbsp;
              <Button color="primary" id="save-entity" data-cy="entityCreateSaveButton" type="submit" disabled={updating}>
                <FontAwesomeIcon icon="save" />
                &nbsp;
                <Translate contentKey="entity.action.save">Save</Translate>
              </Button>
            </ValidatedForm>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default EstpresentUpdate;
