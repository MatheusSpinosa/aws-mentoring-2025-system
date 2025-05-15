import styled from 'styled-components'

export const LoadingContainer = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(255, 255, 255, 0.5);
  
  display: flex;
  align-items: center;
  justify-content: center;

  transition: var(--all-transition);

  opacity: 0;
  visibility: hidden;
  z-index: -1;

  &.active {
    opacity: 1;
    visibility: visible;
    z-index: 99999;
  }
`