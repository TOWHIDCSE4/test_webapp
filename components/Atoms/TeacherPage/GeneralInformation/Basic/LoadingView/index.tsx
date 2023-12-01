/* eslint-disable react/prefer-stateless-function */
import React, { Component, FC } from 'react'

import ReactPlaceholder from 'react-placeholder'
import 'react-placeholder/lib/reactPlaceholder.css'

type Props = {
    customPlaceholder?: any
    children?: any
    rows?: any
    type?: any
    ready?: any
    style?: any
    className?: any
}

const LoadingView: FC<Props> = ({
    customPlaceholder,
    children,
    rows,
    type,
    ready,
    style,
    className
}) => (
    <ReactPlaceholder
        type={type}
        rows={rows}
        ready={ready}
        color='#e6e9ec'
        style={{ ...style, marginBottom: 5 }}
        showLoadingAnimation
        customPlaceholder={customPlaceholder}
        className={className}
    >
        {children}
    </ReactPlaceholder>
)

export default LoadingView
