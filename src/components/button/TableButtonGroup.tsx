import { memo } from 'react';

interface Props {
    children: any;
}

const TableButtonGroup = memo((props: Props) => {
    let buttonGroup = props?.children?.length ? props.children.filter((group: any) => group !== false) : props.children;
    return (
        <div style={{ display: "flex" }}>
            {buttonGroup?.length ? (
                buttonGroup.map((children: any, index: number) => {
                    return (
                        <div key={index} style={{ display: "flex", alignItems: "center" }}>
                            {children}
                            {((buttonGroup.length - 1 !== index)) && (
                                <div style={{ width: "1px", background: "rgba(0,0,0,0.15)", height: "18px", margin: "0px 10px" }} />
                            )}
                        </div>
                    )
                })
            ) : buttonGroup}
        </div>
    )
});

export { TableButtonGroup };