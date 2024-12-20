import React, { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { Translate, ValidatedField, ValidatedForm, translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { mapIdList } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntities as getEtudiants } from 'app/entities/etudiant/etudiant.reducer';
import { getEntities as getDepartements } from 'app/entities/departement/departement.reducer';
import { getEntities as getMatieres } from 'app/entities/matiere/matiere.reducer';
import { createEntity, getEntity, reset, updateEntity } from './classe.reducer';

export const ClasseUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const etudiants = useAppSelector(state => state.etudiant.entities);
  const departements = useAppSelector(state => state.departement.entities);
  const matieres = useAppSelector(state => state.matiere.entities);
  const classeEntity = useAppSelector(state => state.classe.entity);
  const loading = useAppSelector(state => state.classe.loading);
  const updating = useAppSelector(state => state.classe.updating);
  const updateSuccess = useAppSelector(state => state.classe.updateSuccess);

  const handleClose = () => {
    navigate('/classe');
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }

    dispatch(getEtudiants({}));
    dispatch(getDepartements({}));
    dispatch(getMatieres({}));
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
      ...classeEntity,
      ...values,
      etudiants: mapIdList(values.etudiants),
      departement: departements.find(it => it.id.toString() === values.departement?.toString()),
      matieres: mapIdList(values.matieres),
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
          ...classeEntity,
          etudiants: classeEntity?.etudiants?.map(e => e.id.toString()),
          departement: classeEntity?.departement?.id,
          matieres: classeEntity?.matieres?.map(e => e.id.toString()),
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="studamWebApp.classe.home.createOrEditLabel" data-cy="ClasseCreateUpdateHeading">
            <Translate contentKey="studamWebApp.classe.home.createOrEditLabel">Create or edit a Classe</Translate>
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
                  id="classe-id"
                  label={translate('global.field.id')}
                  validate={{ required: true }}
                />
              ) : null}
              <ValidatedField label={translate('studamWebApp.classe.nom')} id="classe-nom" name="nom" data-cy="nom" type="text" />
              <ValidatedField
                label={translate('studamWebApp.classe.etudiant')}
                id="classe-etudiant"
                data-cy="etudiant"
                type="select"
                multiple
                name="etudiants"
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
              <ValidatedField
                id="classe-departement"
                name="departement"
                data-cy="departement"
                label={translate('studamWebApp.classe.departement')}
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
              <ValidatedField
                label={translate('studamWebApp.classe.matiere')}
                id="classe-matiere"
                data-cy="matiere"
                type="select"
                multiple
                name="matieres"
              >
                <option value="" key="0" />
                {matieres
                  ? matieres.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.id}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/classe" replace color="info">
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

export default ClasseUpdate;
