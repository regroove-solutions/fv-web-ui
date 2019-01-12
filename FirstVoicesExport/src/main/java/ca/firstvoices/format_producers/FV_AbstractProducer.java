package ca.firstvoices.format_producers;

abstract public class FV_AbstractProducer
{

    abstract void writeColumnData( String colStr );
    abstract void writeRowData( String rowStr );
}
