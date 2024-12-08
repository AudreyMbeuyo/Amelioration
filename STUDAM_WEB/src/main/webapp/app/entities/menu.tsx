import MenuItem from 'app/shared/layout/menus/menu-item';
import React from 'react';
import { Translate } from 'react-jhipster';

const EntitiesMenu = () => {
  return (
    <>
      {/* prettier-ignore */}
      <MenuItem icon="asterisk" to="/classe">
        <Translate contentKey="global.menu.entities.classe" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/departement">
        <Translate contentKey="global.menu.entities.departement" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/enseignant">
        <Translate contentKey="global.menu.entities.enseignant" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/estpresent">
        <Translate contentKey="global.menu.entities.estpresent" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/etudiant">
        <Translate contentKey="global.menu.entities.etudiant" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/horaire">
        <Translate contentKey="global.menu.entities.horaire" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/matiere">
        <Translate contentKey="global.menu.entities.matiere" />
      </MenuItem>
      {/* jhipster-needle-add-entity-to-menu - JHipster will add entities to the menu here */}
    </>
  );
};

export default EntitiesMenu;
