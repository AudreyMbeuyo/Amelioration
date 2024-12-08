import React, { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { Translate, ValidatedField, ValidatedForm, translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntities as getDepartements } from 'app/entities/departement/departement.reducer';
import { createEntity, getEntity, reset, updateEntity } from './enseignant.reducer';

export const EnseignantUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const departements = useAppSelector(state => state.departement.entities);
  const enseignantEntity = useAppSelector(state => state.enseignant.entity);
  const loading = useAppSelector(state => state.enseignant.loading);
  const updating = useAppSelector(state => state.enseignant.updating);
  const updateSuccess = useAppSelector(state => state.enseignant.updateSuccess);

  const handleClose = () => {
    navigate('/enseignant');
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }

    dispatch(getDepartements({}));
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
      ...enseignantEntity,
      ...values,
      departement: departements.find(it => it.id.toString() === values.departement?.toString()),
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
          ...enseignantEntity,
          departement: enseignantEntity?.departement?.id,
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="studamWebApp.enseignant.home.createOrEditLabel" data-cy="EnseignantCreateUpdateHeading">
            <Translate contentKey="studamWebApp.enseignant.home.createOrEditLabel">Create or edit a Enseignant</Translate>
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
                  id="enseignant-id"
                  label={translate('global.field.id')}
                  validate={{ required: true }}
                />
              ) : null}
              <ValidatedField label={translate('studamWebApp.enseignant.nom')} id="enseignant-nom" name="nom" data-cy="nom" type="text" />
              <ValidatedField
                label={translate('studamWebApp.enseignant.email')}
                id="enseignant-email"
                name="email"
                data-cy="email"
                type="text"
              />
              <ValidatedField
                label={translate('studamWebApp.enseignant.password')}
                id="enseignant-password"
                name="password"
                data-cy="password"
                type="text"
              />
              <ValidatedField
                id="enseignant-departement"
                name="departement"
                data-cy="departement"
                label={translate('studamWebApp.enseignant.departement')}
                type="select"
              >
                <option value="" key="0" />
                {departements
                  ? departements.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.id}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/enseignant" replace color="info">
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

export default EnseignantUpdate;
