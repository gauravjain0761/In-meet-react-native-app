import { EducationValue } from '~/constants/mappingValue';

const useProfileEducation = () => {
  const options = Object.entries(EducationValue).map(([cityKey, cityValue]) => ({
    label: cityValue,
    value: cityKey,
  }));

  return [options];
};

export default useProfileEducation;
