import { Button } from '@mui/material';
import { AddAirplane } from '../components/Airplanes/AddAirplane.js';
import { AirplanesList } from '../components/Airplanes/AirplanesList.js';
import { useCallback, useEffect, useState } from 'react';
import { AirplaneMeta } from '../components/Airplanes/type.js';
import { PageContainer } from 'mvp-shared-files/react';

export const AirplanesPage = () => {
  const [showAdd, setShowAdd] = useState<boolean>(false);
  const [version, setVersion] = useState<number>(1);
  const [selected, setSelected] = useState<AirplaneMeta | undefined>();

  const onDone = useCallback(() => {
    setSelected(undefined);
    setShowAdd(false);
    setVersion((v) => v + 1);
  }, []);

  useEffect(() => {
    if (selected) {
      setShowAdd(true);
    }
  }, [selected]);

  return (
    <PageContainer>
      <AirplanesList version={version} onSelected={setSelected} />
      <Button
        variant="contained"
        disabled={showAdd}
        onClick={() => setShowAdd(true)}
        sx={{ marginTop: 2 }}
      >
        Create
      </Button>
      <AddAirplane show={showAdd} record={selected} onDone={onDone} />
    </PageContainer>
  );
};
