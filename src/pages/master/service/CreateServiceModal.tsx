import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import Grid from "@material-ui/core/Grid";
import { useSelector, shallowEqual } from "react-redux";

import {
	CustomTextBox,
	CustomSelect,
	CustomCheckBox,
	CustomRadioGroup,
} from "components/forms";
import { genderList, masterPaginationServices, billOrderCompleteOptions } from "utils/constants";
import { RootReducerState, SelectOptionsState } from "utils/types";
import { FormModal, HoverLoader } from "components";
import { getFormBody, validationRule } from "utils/global";
import { services } from "utils/services";
import { useCreateDropdownOptions, useToastMessage } from "utils/hooks";
interface Props {
	closeModal: () => void;
	onApiCall: (status: boolean) => void;
}

const CreateServiceModal = (props: Props) => {
	const {
		handleSubmit,
		watch,
		formState: { errors },
		control,
	} = useForm({ mode: "all" });
	const { formatMessage } = useIntl();
	const { closeModal, onApiCall } = props;
	const [loading, setLoading] = useState<boolean>(false);
	const [subDepartmentOptions, setSubDepartmentOptions] = useState<SelectOptionsState[]>([]);
	const { toastMessage } = useToastMessage();

	const { departmentData, itemCharge, serviceCategoryData } = useSelector(
		({ masterPaginationReducer }: RootReducerState) => ({
			departmentData:
				masterPaginationReducer[masterPaginationServices.department].data,
			serviceCategoryData:
				masterPaginationReducer[masterPaginationServices.serviceCategory].data,
			itemCharge:
				masterPaginationReducer[masterPaginationServices.itemCharge].data,
		}),
		shallowEqual
	);
	const departmentOptions = useCreateDropdownOptions(
		departmentData?.modelItems,
		"parentDepartmentId",
		null
	);

	useEffect(() => {
		let departmentId = watch('departmentId')?.value;
		let filterOptions = departmentData?.modelItems?.filter((item: any) => +item.parentDepartmentId === +departmentId).map((item: any) => ({
			label: item.name,
			value: item.id,
		}));
		setSubDepartmentOptions(filterOptions ?? []);
	}, [watch('departmentId')]);

	const taxOptions = useCreateDropdownOptions(itemCharge.modelItems);

	const serviceCategoryOptions = useCreateDropdownOptions(
		serviceCategoryData.modelItems
	);

	function onSubmit(data: any) {
		let bodyData = getFormBody(data);
		bodyData = {
			...bodyData,
			isBillOnOrderOrComlete: data?.isBillOnOrderOrComlete === '1' ? true : false
		};
		setLoading(true);
		services
			.createService(bodyData)
			.then((res) => {
				setLoading(false);
				if (res.data?.succeeded) {
					onApiCall(false);
					toastMessage(formatMessage({ id: "insert-message" }));
					closeModal();
				} else {
					toastMessage(res.data?.messge, "error");
				}
			})
			.catch((err) => {
				setLoading(false);
				toastMessage(err.message, "error");
			});
	}

	return (
		<>
			<FormModal
				onCancel={closeModal}
				onConfirm={handleSubmit(onSubmit)}
				title={formatMessage({ id: "create-service" })}
			>
				<Grid container spacing={2}>
					<Grid item xs={12}>
						<CustomSelect
							options={serviceCategoryOptions}
							label={formatMessage({ id: "service-category" })}
							name="serviceCategoryId"
							control={control}
							error={errors.serviceCategoryId}
							rules={validationRule.textbox({ required: true })}
						/>
					</Grid>
					<Grid item xs={12}>
						<CustomSelect
							options={departmentOptions}
							label={formatMessage({ id: "department" })}
							name="departmentId"
							control={control}
							error={errors.departmentId}
							rules={validationRule.textbox({ required: true })}
						/>
					</Grid>
					<Grid item xs={12}>
						<CustomSelect
							options={subDepartmentOptions}
							label={formatMessage({ id: "sub-department" })}
							name="subDepartmentId"
							control={control}
							error={errors.subDepartmentId}
							rules={validationRule.textbox({ required: true })}
						/>
					</Grid>
					<Grid item xs={12}>
						<CustomSelect
							options={genderList}
							label={formatMessage({ id: "gender-applicability" })}
							name="genderType"
							control={control}
							error={errors.genderType}
							rules={validationRule.textbox({ required: true })}
						/>
					</Grid>
					<Grid item xs={12}>
						<CustomTextBox
							label={formatMessage({ id: "service-name" })}
							name="name"
							control={control}
							error={errors.name}
							rules={validationRule.textbox({
								required: true,
								type: "textWithSpace",
								maxLength: 125,
								minLength: 0,
							})}
						/>
					</Grid>
					<Grid item xs={12}>
						<CustomTextBox
							label={formatMessage({ id: "cpt-code" })}
							name="cptCode"
							control={control}
							error={errors.cptCode}
							rules={validationRule.textbox({
								required: true,
								type: "textWithNumber",
								maxLength: 50,
								minLength: 0,
							})}
						/>
					</Grid>
					<Grid item xs={12}>
						<CustomCheckBox
							name="isPriceEditable"
							label={formatMessage({ id: "price-editible" })}
							control={control}
							error={errors.isPriceEditable}
						/>
					</Grid>
					<Grid item xs={12}>
						<CustomCheckBox
							name="isTaxApplicability"
							label={formatMessage({ id: "tax-applicability" })}
							control={control}
							error={errors.isTaxApplicability}
						/>
					</Grid>
					{(watch("isTaxApplicability") === 1 ||
						watch("isTaxApplicability") === true) && (
							<Grid item xs={12}>
								<CustomSelect
									options={taxOptions}
									label={formatMessage({ id: "tax" })}
									name="itemChargeId"
									control={control}
									error={errors.itemChargeId}
									rules={validationRule.textbox({ required: true })}
								/>
							</Grid>
						)}
					<Grid item xs={12}>
						<CustomCheckBox
							name="isPerformingDoctorRequired"
							label={formatMessage({ id: "performing-doctor-required" })}
							control={control}
							error={errors.isPerformingDoctorRequired}
						/>
					</Grid>
					<Grid item xs={12}>
						<CustomCheckBox
							name="isBillable"
							label={formatMessage({ id: "billable" })}
							control={control}
							error={errors.isBillable}
						/>
					</Grid>
					<Grid item xs={12}>
						<CustomCheckBox
							name="isSerologyTest"
							label={formatMessage({ id: "serology-test" })}
							control={control}
							error={errors.isSerologyTest}
						/>
					</Grid>
					<Grid item xs={12}>
						<CustomCheckBox
							name="isPreOperativeTest"
							label={formatMessage({ id: "pre-operative-test" })}
							control={control}
							error={errors.isPreOperativeTest}
						/>
					</Grid>
					<Grid item xs={12}>
						<CustomRadioGroup
							label={formatMessage({ id: "stage-of-patient-folio" })}
							name="isBillOnOrderOrComlete"
							control={control}
							groupList={billOrderCompleteOptions}
						/>
					</Grid>
					<Grid item xs={12}>
						<CustomCheckBox
							name="isAllowZeroClaimBilling"
							label={formatMessage({ id: "allow-zero-claim-billing" })}
							control={control}
							error={errors.isAllowZeroClaimBilling}
						/>
					</Grid>
				</Grid>
			</FormModal>
			{loading && <HoverLoader />}
		</>
	);
};

export default CreateServiceModal;
