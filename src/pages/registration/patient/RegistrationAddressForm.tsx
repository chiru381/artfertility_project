import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { ControllerProps, FieldErrors, FormProviderProps } from 'react-hook-form';
import Grid from '@material-ui/core/Grid';

import { createCustomCompositeFilter } from 'utils/global';
import { CustomSelect, Select } from 'components/forms';
import { RootReducerState } from 'utils/types';
import { filterOperators, masterPaginationServices } from 'utils/constants';
import { createDropdownOptions, useAsyncDebounce } from 'utils/hooks';
import { getMasterPaginationData } from 'redux/actions';

interface Props {
    errors: FieldErrors;
    control: ControllerProps["control"];
    initialZipCode?: string;
    setValue: FormProviderProps["setValue"];
}

const RegistrationAddressForm = (props: Props) => {
    const { errors, control, initialZipCode, setValue } = props;
    const { formatMessage } = useIntl();
    const dispatch = useDispatch();

    const [province, setProvince] = useState<any>(null);
    const [country, setCountry] = useState<any>(null);

    const [updateZipCodeInitialization, setUpdateZipCodeInitialization] = useState(false);
    const [localityOptions, setLocalityOptions] = useState<{ label: string, value: number }[]>([]);
    const [cityOptions, setCityOptions] = useState<{ label: string, value: number }[]>([]);
    const [provinceOptions, setProvinceOptions] = useState<{ label: string, value: number }[]>([]);
    const [countryOptions, setCountryOptions] = useState<{ label: string, value: number }[]>([]);

    const { zipCodeData, zipCodeDataLoading, provinceData, cityData, localityData, patientLookupData } = useSelector(
        ({ masterPaginationReducer, patientLookupReducer }: RootReducerState) => {
            return ({
                zipCodeData: masterPaginationReducer[masterPaginationServices.zipCodeLookup].data,
                zipCodeDataLoading: masterPaginationReducer[masterPaginationServices.zipCodeLookup].loading,
                provinceData: masterPaginationReducer[masterPaginationServices.province].data,
                cityData: masterPaginationReducer[masterPaginationServices.city].data,
                localityData: masterPaginationReducer[masterPaginationServices.locality].data,
                patientLookupData: patientLookupReducer.data
            })
        },
        shallowEqual
    );
    let zipCodeOptions = zipCodeData.modelItems.map((zipCode: any) => ({ label: zipCode.zipCode, value: zipCode.zipCode }));
    let countries = patientLookupData?.countries ?? []

    // initial update zip code sequence in update screen
    useEffect(() => {
        if (initialZipCode) {
            onZipCodeSearchApi(initialZipCode);
        }
    }, [initialZipCode]);

    // initial update zip code sequence in update screen
    useEffect(() => {
        if (zipCodeData.modelItems.length && !updateZipCodeInitialization && initialZipCode) {
            setUpdateZipCodeInitialization(true);
            let selectedZipCode = zipCodeData.modelItems.find((zipCode: any) => zipCode.zipCode === initialZipCode);
            if (selectedZipCode) {
                onZipCodeSelectedRow(selectedZipCode);
                setValue("zipCode", { label: initialZipCode, value: initialZipCode })
            }
        }
    }, [zipCodeData.modelItems]);

    useEffect(() => {
        if (countries.length) {
            createCountryOptions();
        }
    }, [countries]);

    function createCountryOptions() {
        let country = countries.map((country: any) => ({ label: country.text, value: +country.value }));
        setCountryOptions(country);
    }

    useEffect(() => {
        if (provinceData.modelItems.length) {
            let province = createDropdownOptions(provinceData.modelItems);
            setProvinceOptions(province);
        }
    }, [provinceData.modelItems]);

    useEffect(() => {
        if (cityData.modelItems.length) {
            let city = createDropdownOptions(cityData.modelItems);
            setCityOptions(city);
        }
    }, [cityData.modelItems]);

    useEffect(() => {
        if (localityData.modelItems.length) {
            let locality = createDropdownOptions(localityData.modelItems);
            setLocalityOptions(locality);
        }
    }, [localityData.modelItems]);

    function onZipCodeSelectedRow(row: any) {
        let locality = { label: row.localityName, value: row.localityId };
        let city = { label: row.localityCityName, value: row.localityCityId };
        let province = { label: row.localityCityProvinceName, value: row.localityCityProvinceId };
        let country = { label: row.localityCityProvinceCountryName, value: row.localityCityProvinceCountryId };
        setLocalityOptions([locality]);
        setCityOptions([city]);
        setProvinceOptions([province]);
        setValue("localityId", locality);
        setValue("cityId", city);
        setCountry(country);
        setProvince(province)
    }

    const onChangeValue = useAsyncDebounce((value: string) => {
        onZipCodeSearchApi(value);
    }, 500);

    function onZipCodeSearchApi(value: string) {
        let members = ["zipCode"];
        let params = createCustomCompositeFilter(members, value);

        dispatch(getMasterPaginationData(masterPaginationServices.zipCodeLookup, params));
    }

    function resetZipCode() {
        setLocalityOptions([]);
        setCityOptions([]);
        setProvinceOptions([]);
        createCountryOptions();
        setValue("localityId", null);
        setValue("cityId", null);
        setValue("zipCode", null);
        setCountry(null);
        setProvince(null)
    }

    function onChangeCountry(value: any) {
        if (value) {
            let members = ["countryId"];
            let params = createCustomCompositeFilter(members, String(value.value), filterOperators.isEqualTo, false);

            dispatch(getMasterPaginationData(masterPaginationServices.province, params));
        }
        setProvinceOptions([]);
        setCityOptions([]);
        setLocalityOptions([]);
        setValue("localityId", null);
        setValue("cityId", null);
        setValue("zipCode", null);
        setProvince(null)
    }

    function onChangeProvince(value: any) {
        if (value) {
            let members = ["provinceId"];
            let params = createCustomCompositeFilter(members, String(value.value), filterOperators.isEqualTo, false);

            dispatch(getMasterPaginationData(masterPaginationServices.city, params));
        }
        setCityOptions([]);
        setLocalityOptions([]);
        setValue("localityId", null);
        setValue("cityId", null);
        setValue("zipCode", null);
    }

    function onChangeCity(value: any) {
        if (value) {
            let members = ["cityId"];
            let params = createCustomCompositeFilter(members, String(value.value), filterOperators.isEqualTo, false);

            dispatch(getMasterPaginationData(masterPaginationServices.locality, params));
        }
        setLocalityOptions([]);
        setValue("localityId", null);
        setValue("zipCode", null);
    }

    function onChangeLocality(value: any) {
        if (value) {
            let members = ["localityId"];
            let params = createCustomCompositeFilter(members, String(value.value), filterOperators.isEqualTo, false);

            dispatch(getMasterPaginationData(masterPaginationServices.zipCodeLookup, params));
            setValue("zipCode", null);
        }
    }

    function onChangeZipCode(value: any) {
        if (value?.value) {
            let selectedZipCode = zipCodeData.modelItems.find((zipCode: any) => zipCode.zipCode === value?.value);
            if (selectedZipCode) {
                onZipCodeSelectedRow(selectedZipCode);
            }
        } else {
            resetZipCode();
        }
    }

    return (
        <>
            <Grid item xs={12} lg={3} md={4} sm={6}>
                <CustomSelect
                    label={formatMessage({ id: "zip-code" })}
                    options={zipCodeOptions}
                    control={control}
                    name="zipCode"
                    error={errors.zipCode}
                    rules={{ required: true }}
                    onInputChange={(event: object, value: string, reason: string) => {
                        if (reason === 'input') {
                            onChangeValue(value);
                        }
                    }}
                    onChangeValue={value => onChangeZipCode(value)}
                    loading={zipCodeDataLoading}
                    placeholder="Search Zip Code"
                    textFieldProps={{
                        helperText: "Type ZipCode and Select from Drop-Down"
                    }}
                />
            </Grid>

            <Grid item xs={12} lg={3} md={4} sm={6}>
                <CustomSelect
                    label={formatMessage({ id: "area" })}
                    options={localityOptions}
                    control={control}
                    name="localityId"
                    error={errors.localityId}
                    rules={{ required: true }}
                    onChangeValue={value => onChangeLocality(value)}
                    disableClearable
                />
            </Grid>
            <Grid item xs={12} lg={3} md={4} sm={6}>
                <CustomSelect
                    label={formatMessage({ id: "city" })}
                    options={cityOptions}
                    control={control}
                    name="cityId"
                    error={errors.cityId}
                    rules={{ required: true }}
                    onChangeValue={value => onChangeCity(value)}
                    disableClearable
                />
            </Grid>
            <Grid item xs={12} lg={3} md={4} sm={6}>
                <Select
                    label={formatMessage({ id: "state" })}
                    value={province}
                    onChange={(_, data: any) => {
                        onChangeProvince(data);
                        setProvince(data)
                    }}
                    options={provinceOptions}
                    disableClearable
                />
            </Grid>
            <Grid item xs={12} lg={3} md={4} sm={6}>
                <Select
                    label={formatMessage({ id: "country" })}
                    onChange={(_, data: any) => {
                        onChangeCountry(data);
                        setCountry(data);
                    }}
                    value={country}
                    options={countryOptions}
                    disableClearable
                />
            </Grid>
        </>
    )
}

export default RegistrationAddressForm
