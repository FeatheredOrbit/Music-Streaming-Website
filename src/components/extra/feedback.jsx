import "../../styles/feedback.css";

export default function Feedback({ err, mes }) {
    return (
        <>
            <img className={"feedback " + err + "Chain"} src="assets/shared/foreground/feedback_chain.png" />
            <img className={"feedback " + err} src="assets/shared/foreground/feedback_base.png"/>
        </>
    );
}