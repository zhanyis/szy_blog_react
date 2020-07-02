import Head from 'next/head'

const Header = (props) => (
    <Head>
        <link rel="short icon" href="../static/images/favicon.png" type="image/x-icon" />
        <title>{props.name}</title>
    </Head>
)

export default Header