import React, { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { Translate, ValidatedField, ValidatedForm, translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { Jour } from 'app/shared/model/enumerations/jour.model';
import { createEntity, getEntity, reset, updateEntity } from './horaire.reducer';

export const HoraireUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const horaireEntity = useAppSelector(state => state.horaire.entity);
  const loading = useAppSelector(state => state.horaire.loading);
  const updating = useAppSelector(state => state.horaire.updating);
  const updateSuccess = useAppSelector(state => state.horaire.updateSuccess);
  const jourValues = Object.keys(Jour);

  const handleClose = () => {
    navigate('/horaire');
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }
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
    values.heureDebut = convertDateTimeToServer(values.heureDebut);
    values.heureFin = convertDateTimeToServer(values.heureFin);

    const entity = {
      ...horaireEntity,
      ...values,
    };

    if (isNew) {
      dispatch(createEntity(entity));
    } else {
      dispatch(updateEntity(entity));
    }
  };

  const defaultValues = () =>
    isNew
      ? {
          heureDebut: displayDefaultDateTime(),
          heureFin: displayDefaultDateTime(),
        }
      : {
          jour: 'LUNDI',
          ...horaireEntity,
          heureDebut: convertDateTimeFromServer(horaireEntity.heureDebut),
          heureFin: convertDateTimeFromServer(horaireEntity.heureFin),
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="studamWebApp.horaire.home.createOrEditLabel" data-cy="HoraireCreateUpdateHeading">
            <Translate contentKey="studamWebApp.horaire.home.createOrEditLabel">Create or edit a Horaire</Translate>
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
                  id="horaire-id"
                  label={translate('global.field.id')}
                  validate={{ required: true }}
                />
              ) : null}
              <ValidatedField label={translate('studamWebApp.horaire.jour')} id="horaire-jour" name="jour" data-cy="jour" type="select">
                {jourValues.map(jour => (
                  <option value={jour} key={jour}>
                    {translate(`studamWebApp.Jour.${jour}`)}
                  </option>
                ))}
              </ValidatedField>
              <ValidatedField
                label={translate('studamWebApp.horaire.heureDebut')}
                id="horaire-heureDebut"
                name="heureDebut"
                data-cy="heureDebut"
                type="datetime-local"
                placeholder="YYYY-MM-DD HH:mm"
              />
              <ValidatedField
                label={translate('studamWebApp.horaire.heureFin')}
                id="horaire-heureFin"
                name="heureFin"
                data-cy="heureFin"
                type="datetime-local"
                placeholder="YYYY-MM-DD HH:mm"
              />
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/horaire" replace color="info">
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

export default HoraireUpdate;
