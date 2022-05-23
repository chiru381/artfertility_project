import { useState, useEffect, useContext } from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import Box from "@material-ui/core/Box";
import { useIntl } from "react-intl";

import CustomTable from "components/table";
import {
	TableCreateButton,
	TableButtonGroup,
	TableEditButton,
	DeleteButton,
} from "components/button";
import { getMasterPaginationData } from "redux/actions";
import {
	tableInitialState,
	masterPaginationServices,
	serviceColumns,
} from "utils/constants";
import RootContext from "utils/context/RootContext";
import { RootReducerState } from "utils/types";
import { getTableParams } from "utils/global";
import CreateServiceModal from "./CreateServiceModal";
import UpdateServiceModal from "./UpdateServiceModal";
import { services } from "utils/services";

export default function Service() {
	const { toastMessage } = useContext<any>(RootContext);
	const { formatMessage } = useIntl();
	const dispatch = useDispatch();

	const [createServiceModalOpen, setCreateServiceModalOpen] = useState(false);
	const [updateServiceModalOpen, setUpdateServiceModalOpen] = useState(false);
	const [selectedRow, setSelectedRow] = useState({});
	const [tableState, setTableState] = useState(tableInitialState);
	const [deleteLoading, setDeleteLoading] = useState(false);

	const { serviceData, loading } = useSelector(
		({ masterPaginationReducer }: RootReducerState) => ({
			serviceData:
				masterPaginationReducer[masterPaginationServices.service].data,
			loading:
				masterPaginationReducer[masterPaginationServices.service].loading,
		}),
		shallowEqual
	);

	useEffect(() => {
		onApiCall();
	}, [tableState]);

	useEffect(() => {
		//FORM DROPDOWN SERVICES
		dispatch(getMasterPaginationData(masterPaginationServices.department, {}));
		dispatch(
			getMasterPaginationData(masterPaginationServices.serviceCategory, {})
		);
		dispatch(getMasterPaginationData(masterPaginationServices.itemCharge, {}));
	}, []);


	function onApiCall(withState: boolean = true) {
		const params = getTableParams(tableState);
		dispatch(getMasterPaginationData(masterPaginationServices.service, params));
	}

	function onDeleteData(data: any) {
		const parms = {
			serviceId: data.id,
		};
		setDeleteLoading(true);
		services
			.deleteService(parms)
			.then((res) => {
				setDeleteLoading(false);
				if (res.data?.succeeded) {
					onApiCall();
					toastMessage(formatMessage({ id: "delete-message" }));
				} else {
					toastMessage(res.data?.message, "error");
				}
			})
			.catch((err) => {
				setDeleteLoading(false);
				toastMessage(err.message, "error");
			});
	}

	const { modelItems, totalRecord } = serviceData;

	let columnAction = {
		label: "",
		name: "",
		options: {
			customBodyRender: (_: any, tableMeta: any) => {
				return (
					<TableButtonGroup>
						<TableEditButton
							onClick={() => {
								setSelectedRow(modelItems[tableMeta.rowIndex]);
								setUpdateServiceModalOpen(true);
							}}
						/>

						<DeleteButton
							onDelete={() => onDeleteData(modelItems[tableMeta.rowIndex])}
						/>
					</TableButtonGroup>
				);
			},
		},
	};

	return (
		<>
			<Box className="table-container">
				<CustomTable
					columns={[columnAction, ...serviceColumns(formatMessage)]}
					tableData={modelItems}
					tableState={tableState}
					rowsCount={totalRecord}
					setTableState={setTableState}
					title="Service List"
					toolbar={
						<TableCreateButton
							onClick={() => setCreateServiceModalOpen(true)}
						/>
					}
					loading={loading || deleteLoading}
				/>
			</Box>

			{createServiceModalOpen && (
				<CreateServiceModal
					closeModal={() => setCreateServiceModalOpen(false)}
					onApiCall={onApiCall}
				/>
			)}

			{updateServiceModalOpen && (
				<UpdateServiceModal
					closeModal={() => setUpdateServiceModalOpen(false)}
					selectedData={selectedRow}
					onApiCall={onApiCall}
				/>
			)}
		</>
	);
}
