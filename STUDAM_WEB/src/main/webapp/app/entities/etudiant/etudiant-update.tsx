import React, { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { Translate, ValidatedField, ValidatedForm, translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { mapIdList } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntities as getMatieres } from 'app/entities/matiere/matiere.reducer';
import { getEntities as getClasses } from 'app/entities/classe/classe.reducer';
import { createEntity, getEntity, reset, updateEntity } from './etudiant.reducer';

export const EtudiantUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const matieres = useAppSelector(state => state.matiere.entities);
  const classes = useAppSelector(state => state.classe.entities);
  const etudiantEntity = useAppSelector(state => state.etudiant.entity);
  const loading = useAppSelector(state => state.etudiant.loading);
  const updating = useAppSelector(state => state.etudiant.updating);
  const updateSuccess = useAppSelector(state => state.etudiant.updateSuccess);

  const handleClose = () => {
    navigate('/etudiant');
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }

    dispatch(getMatieres({}));
    dispatch(getClasses({}));
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
      ...etudiantEntity,
      ...values,
      matieres: mapIdList(values.matieres),
      classes: mapIdList(values.classes),
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
          ...etudiantEntity,
          matieres: etudiantEntity?.matieres?.map(e => e.id.toString()),
          classes: etudiantEntity?.classes?.map(e => e.id.toString()),
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="studamWebApp.etudiant.home.createOrEditLabel" data-cy="EtudiantCreateUpdateHeading">
            <Translate contentKey="studamWebApp.etudiant.home.createOrEditLabel">Create or edit a Etudiant</Translate>
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
                  id="etudiant-id"
                  label={translate('global.field.id')}
                  validate={{ required: true }}
                />
              ) : null}
              <ValidatedField
                label={translate('studamWebApp.etudiant.matricule')}
                id="etudiant-matricule"
                name="matricule"
                data-cy="matricule"
                type="text"
              />
              <ValidatedField label={translate('studamWebApp.etudiant.nom')} id="etudiant-nom" name="nom" data-cy="nom" type="text" />
              <ValidatedField
                label={translate('studamWebApp.etudiant.prenom')}
                id="etudiant-prenom"
                name="prenom"
                data-cy="prenom"
                type="text"
              />
              <ValidatedField
                label={translate('studamWebApp.etudiant.matiere')}
                id="etudiant-matiere"
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
              <ValidatedField
                label={translate('studamWebApp.etudiant.classe')}
                id="etudiant-classe"
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
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/etudiant" replace color="info">
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

export default EtudiantUpdate;
