import Paper, { PaperProps } from '@material-ui/core/Paper';

interface Props {
    label?: string;
    labelClassName?: string;
    children: React.ReactElement;
    paperProps?: PaperProps;
}

const PaperWithLabel = ({ label, children, paperProps, labelClassName }: Props) => {
    return (
        <Paper
            elevation={0}
            style={{ background: '#FBFBFB', border: "1px solid #C2C2C2" }}
            {...paperProps}
        >
            <div style={{ padding: '10px', background: '#E6E5E5' }}>
                <span className={`text-13 font-medium ${labelClassName ?? ""}`}>
                    {label}
                </span>
            </div>

            <div style={{ padding: "10px" }}>
                {children}
            </div>
        </Paper>
    )
}

export { PaperWithLabel };