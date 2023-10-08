import styled from "styled-components";

export const LayoutContainer = styled.div`

max-width: 74rem;
height: 38.5rem;
margin: 4rem auto;
padding: 2.5rem;
background-color: ${props => {return props.theme["gray-800"];}};
border-radius: 8px;
display: flex;
flex-direction: column;
`
