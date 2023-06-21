/* eslint-disable react/jsx-handler-names */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-props-no-spreading  */

import type { TabsProps } from 'antd'
import { Tabs } from 'antd'
import type { CatalogueItemType } from 'types/CatalogueItem.type'
import { getFileFormat } from 'utils/String.util'
import CopyLinkButton from './CopyLinkButton'

interface Props {
	catalogueItem: CatalogueItemType
}

const CatalogueItemData = ({ catalogueItem }: Props) => {
	const {
		links,

		'data-columns': dataColumns,
		'sample-data': sampleData
	} = catalogueItem

	const trainingDatasets = links.filter(link =>
		link.type.includes('training-dataset')
	)
	const datasets = links.filter(link => link.type.startsWith('dataset-'))

	let trainingDatasetSection
	if (trainingDatasets.length > 0) {
		trainingDatasetSection = (
			<div className='flex flex-col gap-2'>
				<span className='mb-1 font-semibold text-gray-700'>
					Training Datasets
				</span>
				{trainingDatasets.map(dataset => (
					<div className='flex flex-col ' key={dataset.description}>
						<div className='mb-2 w-2/3'>
							<a
								href={dataset.url}
								key={`${dataset.description}`}
								target='_blank'
								rel='noreferrer'
								className='hover:underline'
							>
								{dataset.description}
							</a>
						</div>
						<div>
							<CopyLinkButton
								url={dataset.url ?? ''}
								placeholder={
									dataset.type.includes('raw')
										? getFileFormat(dataset.type, 'dataset-raw-').toUpperCase()
										: getFileFormat(dataset.type, 'dataset-').toUpperCase()
								}
							/>
						</div>
					</div>
				))}
			</div>
		)
	}

	let rawDatasetsSection
	if (datasets.length > 0) {
		rawDatasetsSection = (
			<div className='flex flex-col gap-2'>
				<span className='mb-1 font-semibold text-gray-700'>
					Results Datasets
				</span>
				{datasets.map(dataset => (
					<div className='flex flex-row items-center' key={dataset.description}>
						<div>
							<div className='mb-5 text-sm font-bold text-gray-700'>
								{dataset.name}
							</div>
							<div className='mb-3'>
								<a
									href={dataset.url}
									key={`${dataset.description}`}
									target='_blank'
									rel='noreferrer'
									className='hover:underline'
								>
									{dataset.description}xxxx
								</a>
							</div>
							<div className='flex'>
								{dataset['alt-format']
									? dataset['alt-format'].map((altFormat, index) => (
											<div key={index} className='mr-2 mb-4'>
												<CopyLinkButton
													url={altFormat.url}
													placeholder={
														altFormat.type.includes('raw')
															? getFileFormat(
																	altFormat.type,
																	'dataset-raw-'
															  ).toUpperCase()
															: getFileFormat(
																	altFormat.type,
																	'dataset-'
															  ).toUpperCase()
													}
												/>
											</div>
									  ))
									: undefined}
							</div>
						</div>
					</div>
				))}
			</div>
		)
	}

	let dataColumnsSection
	if (dataColumns) {
		dataColumnsSection = (
			<div className='flex flex-col' data-cy='catalog-item-data-schema'>
				<div className='flex max-h-[500px] flex-col overflow-y-scroll'>
					<table className='border-collapse'>
						<thead>
							<tr className='bg-gray-300'>
								<td className='p-2 font-semibold text-cloud-burst'>
									Column Name
								</td>
								<td className='p-2 font-semibold text-cloud-burst'>Type</td>
							</tr>
						</thead>
						<tbody>
							{dataColumns.map(column => (
								<tr key={column.name} className='even:bg-gray-100'>
									<td className='p-2 font-medium'>{column.name}</td>
									<td className='p-2'>{column.type.toUpperCase()}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		)
	}

	let dataPreviewSection
	if (sampleData) {
		dataPreviewSection = (
			<div className='flex flex-col'>
				<table className='block table-auto border-collapse overflow-x-scroll'>
					{dataColumns ? (
						<thead>
							<tr className='bg-gray-300'>
								<td className='px-2 py-1' />
								{dataColumns.map(column => (
									<td
										key={column.name}
										className='min-w-[100px] max-w-[500px] py-1 px-2 font-semibold text-cloud-burst'
									>
										{column.name}
									</td>
								))}
							</tr>
						</thead>
					) : undefined}
					<tbody>
						{sampleData.map((row, rowIndex) => (
							<tr key={rowIndex} className='even:bg-gray-100'>
								<td className='px-2 py-1 font-semibold text-cloud-burst'>
									{rowIndex}
								</td>
								{row.map((field, fieldIndex) => (
									<td
										className='px-2 py-1 font-medium'
										key={`${field}-${fieldIndex}`}
									>
										<div className='max-h-[100px] min-w-[100px] max-w-[500px] overflow-y-scroll '>
											{field}
										</div>
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</div>
		)
	}

	const tabItems = [
		{
			key: '1',
			label: '\u00A0 \u00A0 Data Schema',
			children: dataColumnsSection && dataColumnsSection
		},
		{
			key: '2',
			label: 'Data Preview',
			children: dataPreviewSection && dataPreviewSection
		}
	]

	const renderTabBar: TabsProps['renderTabBar'] = (props, DefaultTabBar) => (
		<DefaultTabBar
			{...props}
			style={{
				background: '#F3F4F6',
				fontWeight: 500,
				color: '#82838D',
				marginBottom: 0
			}}
		/>
	)

	return (
		<div className='mb-5 flex flex-col'>
			{trainingDatasetSection}
			{rawDatasetsSection}
			<div className='mt-5 mb-2 font-semibold text-gray-700'>
				Results Preview
			</div>
			<Tabs defaultActiveKey='1' items={tabItems} renderTabBar={renderTabBar} />
		</div>
	)
}

export default CatalogueItemData
