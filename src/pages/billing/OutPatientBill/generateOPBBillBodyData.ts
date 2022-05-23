import { removeNullFromObject } from "utils/global";

export function generateOPBillBodyData(selectedPatient: { [key: string]: any }, serviceItem: { [key: string]: any }[],
    billType: number, totalAmount: number, totalDiscount: number, depositAmountAvail: any) {

    let { uhid, fullName: patientName, genderName, isVIP, telephone, doctorUserDisplayName: registeringDoctor, patientNote: patientNotes,
        currentAge: ageInYear, wifeCouples, id: patientId, paymentTypeId, tariffId, refferingDoctorId: referringDoctorId, birthDate,
        genderId, insurancePlans, insuranceNumber, insuranceValidFrom, insuranceValidTo, refereneNumber, planLimit, payerInsuranceCompanyId,
        payerInsuranceCompanyPrimarySponsorId, doctorId } = selectedPatient;

    let data: any = {
        uhid, patientName, genderName, isVIP, telephone, registeringDoctor, patientNotes,
        ageInYear, patientId, paymentTypeId, referringDoctorId, birthDate, genderId,
        billAmount: totalAmount,
        discountAmount: totalDiscount,
        depositAmountAvail: depositAmountAvail ?? 0,
        billType,
        taxAmount: 0,
        isDayCareInvoice: true,
        registeringDoctorId: doctorId
    }
    if (paymentTypeId === 2) {
        data = {
            ...data,
            insurancePlanName: insurancePlans?.[0]?.insurancePlanName ?? null,
            insuranceNumber, insuranceValidFrom, insuranceValidTo, refereneNumber, planLimit,
            sponsorInsuranceCompanyId: payerInsuranceCompanyPrimarySponsorId,
            payerInsuranceCompanyId, tariffId,
            encounterTypesCodeId: 1, //ask question
            encounterStartTypeId: 1,
            encounterEndTypeId: 1
        }
    }
    let outPatientDiscounts = serviceItem.filter((payment: any) => payment.discountAmount);
    let billingBodyData: any = {
        ...removeNullFromObject(data),
        outPatientBillingBreakups: serviceItem.map(({ billingCode, cptCode, discountAmount,
            discountPerchantage, discountReasonId, discountTypeId, roleId, serviceItemName, ...rest }: any) => ({
                billingCode: billingCode ?? "",
                cptCode: cptCode ?? "",
                serviceItemName,
                discountAmount: discountAmount ? +discountAmount : 0,
                discountPerchantage: discountPerchantage ? +discountPerchantage : 0,
                discountReasonId: discountReasonId ?? 0,
                discountTypeId: discountTypeId ?? 0,
                roleId: roleId ?? 0,
                ...removeNullFromObject(rest)
            }))
    }
    if (wifeCouples?.length) {
        let { husbandFullName, chnId } = wifeCouples[0];
        billingBodyData = {
            ...billingBodyData,
            chnId,
            partnerName: husbandFullName
        }
    }
    if (outPatientDiscounts.length) {
        billingBodyData = {
            ...billingBodyData,
            outPatientDiscounts: outPatientDiscounts.map((payment: any) => ({
                "discountAmount": +payment.discountAmount,
                "discountPer": +payment.discountPerchantage,
                "discountReasonId": payment.discountReasonId,
                "discountTypeId": payment.discountTypeId,
                "roleId": payment.roleId,
                "serviceItemId": payment.serviceItemId ?? null,
                "medicalStaffId": payment.medicalStaffId ?? null
            }))
        }
    }

    return billingBodyData;
}