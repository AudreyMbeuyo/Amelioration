import React, { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { Translate, ValidatedField, ValidatedForm, translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { mapIdList } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntities as getHoraires } from 'app/entities/horaire/horaire.reducer';
import { getEntities as getEnseignants } from 'app/entities/enseignant/enseignant.reducer';
import { getEntities as getClasses } from 'app/entities/classe/classe.reducer';
import { getEntities as getEtudiants } from 'app/entities/etudiant/etudiant.reducer';
import { createEntity, getEntity, reset, updateEntity } from './matiere.reducer';

export const MatiereUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const horaires = useAppSelector(state => state.horaire.entities);
  const enseignants = useAppSelector(state => state.enseignant.entities);
  const classes = useAppSelector(state => state.classe.entities);
  const etudiants = useAppSelector(state => state.etudiant.entities);
  const matiereEntity = useAppSelector(state => state.matiere.entity);
  const loading = useAppSelector(state => state.matiere.loading);
  const updating = useAppSelector(state => state.matiere.updating);
  const updateSuccess = useAppSelector(state => state.matiere.updateSuccess);

  const handleClose = () => {
    navigate('/matiere');
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }

    dispatch(getHoraires({}));
    dispatch(getEnseignants({}));
    dispatch(getClasses({}));
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
      ...matiereEntity,
      ...values,
      horaire: horaires.find(it => it.id.toString() === values.horaire?.toString()),
      enseignant: enseignants.find(it => it.id.toString() === values.enseignant?.toString()),
      classes: mapIdList(values.classes),
      etudiants: mapIdList(values.etudiants),
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
          ...matiereEntity,
          horaire: matiereEntity?.horaire?.id,
          enseignant: matiereEntity?.enseignant?.id,
          classes: matiereEntity?.classes?.map(e => e.id.toString()),
          etudiants: matiereEntity?.etudiants?.map(e => e.id.toString()),
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="studamWebApp.matiere.home.createOrEditLabel" data-cy="MatiereCreateUpdateHeading">
            <Translate contentKey="studamWebApp.matiere.home.createOrEditLabel">Create or edit a Matiere</Translate>
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
                  id="matiere-id"
                  label={translate('global.field.id')}
                  validate={{ required: true }}
                />
              ) : null}
              <ValidatedField
                label={translate('studamWebApp.matiere.libelle')}
                id="matiere-libelle"
                name="libelle"
                data-cy="libelle"
                type="text"
              />
              <ValidatedField label={translate('studamWebApp.matiere.code')} id="matiere-code" name="code" data-cy="code" type="text" />
              <ValidatedField
                id="matiere-horaire"
                name="horaire"
                data-cy="horaire"
                label={translate('studamWebApp.matiere.horaire')}
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
                id="matiere-enseignant"
                name="enseignant"
                data-cy="enseignant"
                label={translate('studamWebApp.matiere.enseignant')}
                type="select"
              >
                <option value="" key="0" />
                {enseignants
                  ? enseignants.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.id}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <ValidatedField
                label={translate('studamWebApp.matiere.classe')}
                id="matiere-classe"
                data-cy="classe"
                type="select"
                multiple
                name="classes"
              >
                <option value="" key="0" />
                {classes
                  ? classes.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.id}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <ValidatedField
                label={translate('studamWebApp.matiere.etudiant')}
                id="matiere-etudiant"
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
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/matiere" replace color="info">
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

export default MatiereUpdate;
